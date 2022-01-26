# espoir-cli


---

## 命令


### espoir {create, new}

* 若当前工作目录位于一个由 espoir 创建的 monorepo 中，则新建一个 package。

在创建 package 时，可以选择预定义的模板，它们由 espoir-cli 内置。

* 若当前工作目录不位于一个由 espoir 创建的 monorepo 中，则新建一个 monorepo。


#### 用例

* `espoir create`


---

### espoir {install, i, ins}

为指定（或所有）子仓库安装新增的依赖，或为指定（或所有）子仓库安装已定义的依赖。


#### 参数

##### optional module-names

将要安装的依赖名，支持多个。

可以使用 `module_name@version_range` 的格式指定一个依赖的版本范围。

缺省时，视为安装已定义的依赖。


#### 设置项

##### {--save, -S} (default: `true`)

将目标依赖安装到仓库的 `dependencies` 字段中。

当提供 `module-names` 时，此选项默认为 `true`。

_当根目录被指定时，`--save` 选项将产生一个错误。这是因为根目录被认为只影响仓库的工程开发，而不影响产物，所以 `dependencies` 字段不被允许。请使用 `--save-dev` 选项或考虑排除根目录。_


##### {--save-dev, -D} (default: `false`)

将目标依赖安装到仓库的 `devDependencies` 字段中。

当提供 `module-names` 时，此选项默认为 `false`。


##### --production (default: `false`)

当未提供 `module-names`，即安装已定义的依赖时，激活这个选项以在生产模式下安装依赖。`devDependencies` 中定义的依赖将不会被安装。此选项默认为 `false`。


##### {--workspace, -w} <workspace...>

指定安装依赖的目标仓库。默认为所有仓库。



#### 用例

* `espoir install`

运行这条命令将为所有子仓库（包括根目录）安装已定义的依赖。

* `espoir install --production`

运行这条命令将为所有子仓库（包括根目录）安装已定义的、生产环境的依赖。

* `espoir install -w root foo`

运行这条命令将为包括根目录（`root`）及子仓库 `foo` 安装已定义的依赖。

* `espoir i react react-dom -w foo`

运行这条命令将为包括子仓库 `foo` 添加并安装依赖 `react`、`react-dom`。

* `espoir i --save-dev @types/react @types/react-dom -w root foo`

运行这条命令将为包括子仓库 `foo` 添加并安装开发环境依赖 `@types/react`、`@types/react-dom`。

* `espoir install -h`

运行这条命令将获取帮助信息。



---

### espoir {run-script, run, r}

运行一条预定义脚本。

对于每一个子仓库而言，它将包括：

* `package.json` 中的 `scripts` 对象.

* `scripts` 目录下的 JS 脚本.

* `tasks` 目录下的 JS 脚本.



#### 参数

##### optional command

脚本名。

可以使用 `package_name.script_name` 的格式指定一个子仓库内定义的指令。

不提供 `package_name` 时，将以当前工作目录向上寻找一个 `package.json` 作为指令的上下文。


##### optional args

提供给指令的参数表，支持多个。



#### 设置项

##### --list (default: `false`)

当未提供 `command` 时，激活此选项以获取可执行的所有脚本名称。



#### 用例

* `espoir run-scripts foo.build`

运行这条命令将执行子仓库 `foo` 的 `build` 脚本。

* `espoir run-scripts --list`

运行这条命令将获取可执行的脚本列表。

* `(/packages/foo/src/utils/) espoir run dev`

运行这条命令将执行子仓库 `foo` 的 `dev` 脚本。

* `(/packages/) espoir run bootstrap`

运行这条命令将执行根目录的 `bootstrap` 脚本。

* `espoir run -h`

运行这条命令将获取帮助信息。



---

### espoir {contribute, contr, cont, c, commit}

提交代码版本。



#### 用例

* `espoir contribute`

运行这条命令将启动提交代码交互。

提交包含以下几个阶段：

1. 检查 git 的缓冲区，如果存在未添加的改动，提示用户进行 **自动添加** / **手动添加并重试** / **中断提交** / **忽略警告继续提交**。

2. 收集信息，生成改动日志和 git 提交注释。

3. 执行提交。

4. 如果需要，则提交到远程分支。


* `espoir contribute -h`

运行这条命令将获取帮助信息。


---


### espoir {uninstall, uni, u, del, remove}

为指定子仓库移除依赖。

若指定了某个并不存在的依赖，则该依赖会被跳过。

卸载时，会检查不再被（任意子仓库或其他包）依赖的依赖进行清理。

若指定的某个依赖同时被其他（任意子仓库或其他包）依赖，则该依赖只将被从指定仓库的依赖项中移除，而不会被物理删除。


#### 参数

##### module-names

将要移除的依赖名，支持多个，且至少提供一个。

#### 设置项

##### --here (default: `false`)

指定当前目录所在子仓库执行操作。

当你确定你的当前工作目录正确时，使用 `--here` 选项以省略 `--workspace` 指定。


##### {--workspace, -w} <...workspace>

指定执行卸载操作的目标仓库。当 `--here` 有效时不需要提供，否则必须提供。



#### 用例

* `espoir uninstall axios jquery -w foo`

运行这条命令将为子仓库 `foo` 卸载依赖 `axios`、`jquery`。

* `(/packages/foo/src/utils/) espoir del axios --here`

运行这条命令将为子仓库 `foo` 卸载依赖 `axios`。

* `espoir uni -h`

运行这条命令将获取帮助信息。


---

### espoir update

升级 espoir-cli。



#### 用例

* `espoir update`

运行这条命令将自动更新 espoir-cli 到最新版本。

