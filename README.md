pdfcheck
========

Utilities to validate pdf content

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pdfcheck.svg)](https://npmjs.org/package/pdfcheck)
[![Downloads/week](https://img.shields.io/npm/dw/pdfcheck.svg)](https://npmjs.org/package/pdfcheck)
[![License](https://img.shields.io/npm/l/pdfcheck.svg)](https://github.com/theBenForce/pdfcheck/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g pdfcheck
$ pdfcheck COMMAND
running command...
$ pdfcheck (-v|--version|version)
pdfcheck/0.0.1 darwin-x64 node-v12.13.1
$ pdfcheck --help [COMMAND]
USAGE
  $ pdfcheck COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pdfcheck accessibility FILE`](#pdfcheck-accessibility-file)
* [`pdfcheck help [COMMAND]`](#pdfcheck-help-command)
* [`pdfcheck list-operators FILE`](#pdfcheck-list-operators-file)
* [`pdfcheck validate-content [FILE]`](#pdfcheck-validate-content-file)

## `pdfcheck accessibility FILE`

describe the command here

```
USAGE
  $ pdfcheck accessibility FILE

ARGUMENTS
  FILE  The file to be checked

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/accessibility.ts](https://github.com/drg-adaptive/pdfcheck/blob/v0.0.1/src/commands/accessibility.ts)_

## `pdfcheck help [COMMAND]`

display help for pdfcheck

```
USAGE
  $ pdfcheck help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `pdfcheck list-operators FILE`

describe the command here

```
USAGE
  $ pdfcheck list-operators FILE

OPTIONS
  -h, --help       show CLI help
  -p, --page=page  limit operator list to a specific page
```

_See code: [src/commands/list-operators.ts](https://github.com/drg-adaptive/pdfcheck/blob/v0.0.1/src/commands/list-operators.ts)_

## `pdfcheck validate-content [FILE]`

describe the command here

```
USAGE
  $ pdfcheck validate-content [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/validate-content.ts](https://github.com/drg-adaptive/pdfcheck/blob/v0.0.1/src/commands/validate-content.ts)_
<!-- commandsstop -->
