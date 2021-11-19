"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 17:53:51
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 01:18:13
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePackageDeps = void 0;
const semver = require("semver");
const request_1 = require("../../../utils/request");
const extra_semver_1 = require("./extra-semver");
/**
 * Returns available versions of a module.
 * Results is sorted by version in descending order.
 *
 * @param {string} name
 * @param {string} version
 * @param {LockData} lockData
 * @returns {(Promise<[null, VersionInfo[]] | [Error, null]>)}
 */
const getAvailableVersions = (name, version, lockData) => new Promise(resolve => {
    // check lock file first
    const what = Object.entries(lockData[name] ?? {});
    const which = what.find(([v]) => semver.satisfies(v, version));
    if (which) {
        // use locked version
        return resolve([
            null, [{
                    name: name,
                    version: which[0],
                    _id: `${name}@${which[0]}`,
                    dist: {
                        integrity: which[1].integrity,
                        tarball: which[1].resolved
                    },
                    dependencies: which[1].requires,
                    lockInfo: which[1]
                }]
        ]);
    }
    request_1.default.npm.view(name).then(([err, data]) => {
        if (err) {
            return resolve([err, null]);
        }
        const tagged = Object.values(data?.['dist-tags'] ?? {});
        const versions = Object.entries(data.versions).reduce((list, [v, d]) => {
            const td = tagged.findIndex(_v => v === _v);
            if (td !== -1) {
                tagged.splice(td);
            }
            if (d.dist?.tarball && semver.satisfies(v, version)) {
                return [...list, d];
            }
            return list;
        }, []);
        if (tagged.length) {
            Promise.all(tagged.map(td => {
                return request_1.default.npm.find(name, td);
            })).then(list => {
                list.forEach(t => {
                    if (t[1]) {
                        versions.push(t[1]);
                    }
                });
                resolve([
                    null,
                    versions.sort(((a, b) => (semver.lt(a.version, b.version) ? 1 : -1)))
                ]);
            });
        }
        else {
            resolve([
                null,
                versions.sort(((a, b) => (semver.lt(a.version, b.version) ? 1 : -1)))
            ]);
        }
    });
});
/**
 * Returns the minimum incompatible set of the dependency.
 *
 * @param {Dependency} dependency
 * @param {LockData} lockData
 * @returns {Promise<{ value: MinIncompatibleSet; failed: Error[]; }>}
 */
const getMinIncompatibleSet = async (dependency, lockData) => {
    const minSet = [];
    const failed = [];
    const coalesced = (0, extra_semver_1.coalesceVersions)(dependency.versions);
    const satisfied = (await Promise.all(coalesced.map(async (v) => {
        const [err, list] = await getAvailableVersions(dependency.name, v, lockData);
        if (err) {
            failed.push(err);
            return null;
        }
        return list;
    }))).filter(Boolean);
    satisfied.forEach(sl => {
        if (sl.length) {
            minSet.push({
                name: sl[0].name,
                version: sl[0].version
            });
        }
    });
    return {
        value: minSet,
        failed
    };
};
/**
 * Resolves all the implicit dependencies.
 *
 * @param {SingleDependency[]} dependencies
 * @param {LockData} lockData
 * @param {VersionInfo[]} [memoized=[]]
 * @param {(resolved: number, unresolved: number) => void} [onProgress]
 * @returns {Promise<{ succeeded: VersionInfo[]; failed: FailedDependency[] }>}
 */
const resolveDependencies = async (dependencies, lockData, memoized = [], onProgress) => {
    const data = [...memoized];
    const entering = [];
    const unresolved = [];
    let running = 0;
    const failed = [];
    const tasks = dependencies.map(async (dep) => {
        const isDeclared = () => Boolean(entering.find(d => d.name === dep.name && semver.satisfies(d.version, dep.version))) || Boolean(data.find(d => d.name === dep.name && semver.satisfies(d.version, dep.version)));
        if (isDeclared()) {
            // this dependency is already resolved
            return;
        }
        running += 1;
        const [err, satisfied] = await getAvailableVersions(dep.name, dep.version, lockData);
        running -= 1;
        onProgress?.(data.length + entering.length + 1, running + entering.length);
        if (isDeclared()) {
            // this dependency is already resolved when checking
            return;
        }
        if (err || ((satisfied?.length ?? 0) === 0)) {
            // there's no versions satisfying the required range
            failed.push({
                ...dep,
                reasons: err ? [err] : [
                    new Error(`no versions satisfy ${dep.version} for ${dep.name}`)
                ]
            });
            return;
        }
        // FIXME: pick the most suitable one
        const target = satisfied[0];
        // add it to the list
        entering.push(target);
        return;
    });
    await Promise.all(tasks);
    if (entering.length) {
        data.push(...entering);
        // collect the dependencies of the entered items
        entering.forEach(item => {
            Object.entries(item.dependencies ?? {}).forEach(([name, range]) => {
                const satisfied = data.find(d => d.name === name && semver.satisfies(d.version, range));
                if (!satisfied) {
                    const declared = unresolved.find(d => d.name === name);
                    if (declared) {
                        if (!declared.versions.includes(range)) {
                            declared.versions.push(range);
                        }
                    }
                    else {
                        unresolved.push({
                            name,
                            versions: [range]
                        });
                    }
                }
            });
        });
        // resolve them
        const items = (await Promise.all(unresolved.map(async (d) => {
            const { value, failed: f } = await getMinIncompatibleSet(d, lockData);
            if (f.length) {
                d.versions.forEach(v => {
                    failed.push({
                        name: d.name,
                        version: v,
                        reasons: f
                    });
                });
                return null;
            }
            return value;
        }))).flat(1).filter(Boolean);
        onProgress?.(data.length, items.length);
        const results = await resolveDependencies(items, lockData, data, onProgress);
        data.push(...results.succeeded.filter(r => {
            return !Boolean(entering.find(d => d.name === r.name && semver.satisfies(d.version, r.version))) && !Boolean(data.find(d => d.name === r.name && semver.satisfies(d.version, r.version)));
        }));
        failed.push(...results.failed);
    }
    return {
        succeeded: data,
        failed
    };
};
/**
 * Resolves all the dependencies given in package.json.
 *
 * @param {Dependency[]} dependencies
 * @param {Readonly<LockData>} lockData
 * @param {(resolved: number, unresolved: number) => void} [onProgress]
 * @returns {Promise<{ succeeded: VersionInfo[]; failed: FailedDependency[] }>}
 */
const resolvePackageDeps = async (dependencies, lockData, onProgress) => {
    const locked = [];
    const failed = [];
    const items = [];
    for (const d of dependencies) {
        const { value, failed: f } = await getMinIncompatibleSet(d, lockData);
        if (f.length) {
            d.versions.forEach(v => {
                failed.push({
                    name: d.name,
                    version: v,
                    reasons: f
                });
            });
            continue;
        }
        items.push(...value);
    }
    const resolved = await resolveDependencies(items, lockData, [], onProgress);
    return {
        succeeded: resolved.succeeded,
        failed: resolved.failed.concat(failed)
    };
};
exports.resolvePackageDeps = resolvePackageDeps;
