"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 17:53:51
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:01:54
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
        if (err || !data) {
            return resolve([
                err ?? new Error(`Failed to get data of "${name}". `),
                null
            ]);
        }
        const tagged = Object.values(data?.['dist-tags'] ?? {});
        if (version === 'latest') {
            if (tagged.includes('latest')) {
                const version = data['dist-tags'].latest;
                const which = data.versions[version];
                if (!which) {
                    request_1.default.npm.find(name, version).then(([err, latest]) => {
                        if (err || !latest) {
                            throw err ?? new Error(`Cannot get "${name}@${version}" (latest version). `);
                        }
                        return resolve([null, [latest]]);
                    });
                    return;
                }
                return resolve([null, [which]]);
            }
            else {
                const version = Object.keys(data.versions).sort((a, b) => (semver.lt(a, b) ? 1 : -1))[0];
                const which = data.versions[version];
                return resolve([null, [which]]);
            }
        }
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
                if (versions.length === 0) {
                    return resolve([
                        new Error(`No version of "${name}" satisfies "${version}". `),
                        null
                    ]);
                }
                return resolve([
                    null,
                    versions.sort((a, b) => (semver.lt(a.version, b.version) ? 1 : -1))
                ]);
            });
        }
        else {
            if (versions.length === 0) {
                return resolve([
                    new Error(`No version of "${name}" satisfies "${version}". `),
                    null
                ]);
            }
            return resolve([
                null,
                versions.sort((a, b) => (semver.lt(a.version, b.version) ? 1 : -1))
            ]);
        }
    });
});
/**
 * Returns the minimum incompatible set of the dependency.
 *
 * @param {Dependency} dependency
 * @param {LockData} lockData
 * @returns {{ version: string; value?: VersionInfo; reason?: Error; }[]>}
 */
const getMinIncompatibleSet = async (dependency, lockData) => {
    const coalesced = (0, extra_semver_1.coalesceVersions)(dependency.versions);
    const results = (await Promise.all(coalesced.map(async (v) => {
        const resp = {
            version: v
        };
        const [err, list] = await getAvailableVersions(dependency.name, v, lockData);
        if (err || !list?.[0]) {
            resp.reason = err ?? new Error(`No version of "${dependency.name}" satisfies "${v}". `);
        }
        else {
            resp.value = list[0];
        }
        return resp;
    })));
    return results;
};
/**
 * Resolves all the implicit dependencies.
 *
 * @param {SingleDependency[]} dependencies
 * @param {LockData} lockData
 * @param {VersionInfo[]} [memoized=[]]
 * @param {(resolved: number, unresolved: number) => void} [onProgress]
 * @returns {Promise<VersionInfo[]>}
 */
const resolveDependencies = async (dependencies, lockData, memoized = [], onProgress) => {
    const data = [...memoized];
    const entering = [];
    const unresolved = [];
    let running = 0;
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
        if (err || !satisfied?.[0]) {
            // there's no versions satisfying the required range
            throw err ?? new Error(`No version of "${dep.name}" satisfies "${dep.version}". `);
        }
        // use the latest one that satisfies required range
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
            const list = (await getMinIncompatibleSet(d, lockData)).filter(res => {
                if (res.reason ?? !res.value) {
                    throw res.reason ?? new Error(`No version of "${d.name}" satisfies "${res.version}". `);
                }
                return true;
            });
            return list.map(res => res.value);
        }))).flat(1);
        onProgress?.(data.length, items.length);
        const nextLevel = await resolveDependencies(items, lockData, data, onProgress);
        nextLevel.forEach(vi => {
            if (!data.find(d => d.name === vi.name && d.version === vi.version)) {
                data.push(vi);
            }
        });
    }
    return data;
};
/**
 * Resolves all the dependencies given in package.json.
 *
 * @param {SingleDependency[]} dependencies
 * @param {Readonly<LockData>} lockData
 * @param {(resolved: number, unresolved: number) => void} [onProgress]
 * @returns {Promise<VersionInfo[]>}
 */
const resolvePackageDeps = async (dependencies, lockData, onProgress) => {
    const resolved = await resolveDependencies(dependencies, lockData, [], onProgress);
    return resolved;
};
exports.resolvePackageDeps = resolvePackageDeps;
