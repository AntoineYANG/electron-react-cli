/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 20:32:10 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:37:08
 */

import * as path from 'path';
import * as fs from 'fs';
import { sync as mkdirp } from 'mkdirp';

import env, { PackageJSON } from '@env';
import { SingleDependency } from './load-dependencies';


export type CliLink = {
  name: string;
  path: string;
};

const linkCLI = (dependencies: SingleDependency[]): CliLink[] => {
  const res: CliLink[] = [];

  dependencies.forEach(({ name: dir }) => {
    const pkgDir = path.resolve(
      env.resolvePath('node_modules', dir)
    );

    const pkgJSON = path.join(
      pkgDir,
      'package.json'
    );
    
    if (fs.existsSync(pkgJSON)) {
      const { bin } = JSON.parse(
        fs.readFileSync(
          pkgJSON, {
            encoding: 'utf-8'
          }
        )
      ) as PackageJSON;

      if (!bin) {
        return;
      }

      if (typeof bin === 'string') {
        const name = dir;

        if (res.find(d => d.name === name)) {
          return;
        }

        res.push({
          name,
          path: path.join(pkgDir, bin)
        });
      } else {
        Object.entries(bin).forEach(([name, p]) => {
          if (res.find(d => d.name === name)) {
            return;
          }

          res.push({
            name,
            path: path.join(pkgDir, p)
          });
        });
      }
    }
  });

  return res;
};

const dir = env.rootDir ? env.resolvePath('.espoir', '.bin') : '.bin';

const writeBin = (name: string, target: string): void => {
  const fn = path.join(dir, name);

  // shell
  fs.writeFileSync(
    fn,
`#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  exec "$basedir/node"  "${target}" "$@"
else 
  exec node  "${target}" "$@"
fi
`, {
      encoding: 'utf-8'
    }
  );

  // cmd
  fs.writeFileSync(
    `${fn}.cmd`,
`@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\node.exe" (
  SET "_prog=%dp0%\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "${target}" %*
`, {
      encoding: 'utf-8'
    }
  );

  // ps
  fs.writeFileSync(
    `${fn}.ps1`,
`#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "$basedir/node$exe"  "${target}" $args
  } else {
    & "$basedir/node$exe"  "${target}" $args
  }
  $ret=$LASTEXITCODE
} else {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "node$exe"  "${target}" $args
  } else {
    & "node$exe"  "${target}" $args
  }
  $ret=$LASTEXITCODE
}
exit $ret
`, {
      encoding: 'utf-8'
    }
  );
};

export const writeLinks = (links: CliLink[]): void => {
  if (!fs.existsSync(dir)) {
    mkdirp(dir);
  }

  links.forEach(({ name, path: p }) => {
    writeBin(name, p);
  });
};


export default linkCLI;
