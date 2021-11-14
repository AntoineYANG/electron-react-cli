/*
 * @Author: Kanata You 
 * @Date: 2021-11-13 23:44:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 01:43:11
 */

const env = require('../env.js');
const { getAvailableVersions } = require('./resolve-deps.js');


class DependentSource {

  /**
   * @type {string}
   * @memberof DependentSource
   */
  name;

  /**
   * Creates an instance of DependentSource.
   * @param {string} name
   * @memberof DependentSource
   */
  constructor(name) {
    this.name = name;
  }

}

/** @type {import('./dependencies').DependencyType[]} */
const keys = [
  'dependencies',
  'devDependencies'
];

/** @type {import('./dependencies').DependencyType[]} */
const keysNotAllowedInRoot = [
  'dependencies'
];

/** @type {import('./dependencies').DependencyType[]} */
const keysNotAllowedInPackages = [];

/**
 * Reshape dependencies into flat list.
 * 
 * @param {import('./dependencies').AllDependencies} set
 * @returns {{name:string;version:string;}[]}
 */
const parseDependencies = set => {
  /** @type {{name:string;version:string;}[]} */
  const list = [];

  keys.forEach(key => {
    Object.entries(set[key] ?? {}).forEach(([k, v]) => {
      v.forEach(d => {
        list.push({
          name: k,
          version: d.to
        });
      })
    });
  });

  return list;
};

/**
 * Resolves dependencies.
 * 
 * @param {import('./dependencies').AllDependencies} set
 * @param {import('../../scripts/node-package').InstallOptions} options install options
 * @returns {Promise<import('./dependencies').DependencySet>}
 */
const resolveDependencies = async (set, options) => {
  /** @type {import('./dependencies').DependencySet} */
  const actualDeps = {};

  const depList = parseDependencies(set);

  let needResolve = [...depList];

  const next = (who = null) => new Promise((resolve, reject) => {
    const [dep] = needResolve;

    if (!actualDeps[dep.name]) {
      actualDeps[dep.name] = [];
    }
    const target = actualDeps[dep.name];

    getAvailableVersions(dep.name, dep.version, options).then(vs => {
      const [data] = vs;
      // concat
      target.push({
        from: [who],
        to: data.version
      });
    });
  });

  await next();

  return actualDeps;
};

/**
 * Appends a dependency info into the set.
 * 
 * @param {(string|DependentSource)[]} sources who requires this dependency
 * @param {import('./dependencies').AllDependencies} set
 * @param {import('./dependencies').DependencyType} where
 * @param {string} name
 * @param {string} version
 */
const appendDependency = async (sources, set, where, name, version) => {
  for (const key of keys) {
    if (set[key]) {
      const data = set[key];
      
      if (data[name]) {
        // already exits
        const list = [...data[name]];
        // TODO: removes the repeated items
        list.push({
          from: sources,
          to: version
        });

        return;
      }

      // it's not necessary to check other entries
      break;
    }
  }

  // not required yet -> append
  const target = set[where];
  target[name] = [{
    from: sources,
    to: version
  }];
};

/**
 * Concat all the dependency sets.
 *
 * @param {import('./dependencies').AllDependencies[]} sets
 * @returns {import('./dependencies').AllDependencies}
 */
const concatDependencies = (...sets) => {
  /** @type {import('./dependencies').AllDependencies} */
  const results = {
    dependencies: {},
    devDependencies: {}
  };
  
  // If the module is defined in different tags,
  // it's important to make sure it will be finally recorded only once.
  // For example,
  // if a module is defined in `dependencies` and `devDependencies`,
  // it will only be recorded in `dependencies`,
  // according to the order defined as `keys`.
  keys.forEach(key => {
    sets.forEach(p => {
      Object.entries(p[key] ?? {}).forEach(([k, v]) => {
        v.forEach(d => {
          appendDependency(
            d.from,
            results,
            key,
            k,
            d.to
          );
        });
      });
    });
  });

  return results;
};

/**
 * Analyzes the dependencies of the package.
 *
 * @param {string} name
 * @param {string} package
 * @returns {import('./dependencies').AllDependencies}
 */
const getAllDependenciesInPackage = (name, package) => {
  const source = new DependentSource(name);
  /** @type {import('./dependencies').AllDependencies} */
  const results = {};
  
  keys.forEach(key => {
    results[key] = {};
    
    if (keysNotAllowedInPackages.includes(key)) {
      console.warn(
        `\`${key}\` in \`package.json\` (${name}) is found, which is not suggested. `
        + 'Move them to `devDependencies` or any child package instead. '
      );

      return;
    }

    Object.entries(package[key] || {}).forEach(([mod, version]) => {
      appendDependency(
        [source],
        results,
        key,
        mod,
        version
      );
    });
  });

  return results;
};

/**
 * Analyzes the dependencies of the root.
 *
 * @returns {import('./dependencies').AllDependencies}
 */
const getAllDependenciesInRoot = () => {
  const source = new DependentSource('root');
  /** @type {import('./dependencies').AllDependencies} */
  const results = {};
  
  keys.forEach(key => {
    results[key] = {};
    
    if (keysNotAllowedInRoot.includes(key)) {
      console.warn(
        `\`${key}\` in root \`package.json\` is found, which is not suggested. `
        + 'Move them to `devDependencies` or any child package instead. '
      );

      return;
    }

    Object.entries(env.rootPkg[key] || {}).forEach(([mod, version]) => {
      appendDependency(
        [source],
        results,
        key,
        mod,
        version
      );
    });
  });

  return results;
};


module.exports = {
  DependentSource,
  concatDependencies,
  getAllDependenciesInRoot,
  getAllDependenciesInPackage
};
