# espoir-cli


## Languages

* [简体中文](./README-zh.md)

---

## Commands


### espoir {install, i}

Add new dependency (dependencies) to the given (or all) package, or install the defined dependencies.


#### Arguments

##### optional module-names

Names of dependencies, split by spaces.

It's useful to limit the version of a dependency by typing it in the shape of `module_name@version_range`.

If this argument is not given, the command will be regarded as installing the defined dependencies in `package.json`.


#### Options

##### {--save, -S} (default: `true`)

Add the dependencies as `dependencies`.

When `module-names` is given, `--save` flag is default to be `true`.

_If the root package is included, `--save` flag will lead to an error. Remember that we use the root package only to do something in the development environment, the root package should have no effects on the product. So `dependencies` in the root package is not allowed. Please use `--save-dev` to add the dependencies as `devDependencies`, or just exclude the root package._


##### {--save-dev, -D} (default: `false`)

Add the dependencies as `devDependencies`.

When `module-names` is given, `--save-dev` flag is default to be `false`.


##### --production (default: `false`)

When `module-names` is not given, in other word, installing the defined dependencies, enable `--production` flag to do installation in production mode. This flag is default to be `false`.


##### {--workspace, -w} <workspace...>

Set the package(s) in which to install the dependencies. Default to be all the packages (including the root package).



#### Examples

* `espoir install`

Install all defined dependencies in all the packages (including the root package).

* `espoir install --production`

Install all defined dependencies, exclusive of `devDependencies`, in all the packages (including the root package).

* `espoir install -w root foo`

Install all defined dependencies in package `foo` and the root package.

* `espoir i react react-dom -w foo`

Install dependencies `react`, `react-dom` in package `foo` and append them to the `dependencies` of `foo`.

* `espoir i --save-dev @types/react @types/react-dom -w root foo`

Install dependencies `@types/react`, `@types/react-dom` in both package `foo` and the root package, and append them to the `devDependencies` of the two packages.

* `espoir install -h`

Show help info.


---

### espoir {run-script, run}

Execute a defined script in `package.json`.


#### Arguments

##### optional command

Name of the script.

It's useful to call a script in one package like `package_name.script_name`.

When `package_name` is not given, it will use the directory of the closest `package.json` as the current working directory.


##### optional args

Arguments for the script.



#### Options

##### --list (default: `false`)

When `command` is not given, activate `--list` flag to get all available scripts.



#### Examples

* `espoir run-scripts foo.build`

Execute script `build` defined in `package.json` in package `foo`.

* `espoir run-scripts --list`

Show all available scripts.

* `(/packages/foo/src/utils/) espoir run dev`

Execute script `dev` defined in `package.json` in package `foo`.

* `(/packages/) espoir run bootstrap`

Execute script `bootstrap` defined in `package.json` in the root package.

* `espoir run -h`

Show help info.



---

### espoir {contribute, c}

Commit the changes.


#### Examples.

* `espoir contribute`

Start commit interaction.

It contains these steps:

1. Check git state. If some changes are not staged yet, it will send warnings, and allow you to 1) **include automatically** 2) **retry after operation** 3) **abort this commit task** 4) **ignore the warnings and continue to commit**。

2. Requires for several questions to generate the changelog and the commit message.

3. Do git commit.

4. Do git push if necessary.




