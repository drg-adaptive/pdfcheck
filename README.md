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
pdfcheck/0.0.0 darwin-x64 node-v12.13.1
$ pdfcheck --help [COMMAND]
USAGE
  $ pdfcheck COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pdfcheck accessibility [FILE]`](#pdfcheck-accessibility-file)
* [`pdfcheck hello [FILE]`](#pdfcheck-hello-file)
* [`pdfcheck help [COMMAND]`](#pdfcheck-help-command)

## `pdfcheck accessibility [FILE]`

describe the command here

```
USAGE
  $ pdfcheck accessibility [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/accessibility.ts](https://github.com/theBenForce/pdfcheck/blob/v0.0.0/src/commands/accessibility.ts)_

## `pdfcheck hello [FILE]`

describe the command here

```
USAGE
  $ pdfcheck hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ pdfcheck hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/theBenForce/pdfcheck/blob/v0.0.0/src/commands/hello.ts)_

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
<!-- commandsstop -->
