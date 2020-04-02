# 1 April 2020

## Failure of `node` to resolve module specified in ES2020 `import * as foo` syntax

Problem: `node` v13.12.0 improperly resolves the location of the requested module, when compiled by `tsc` when `module` is set to `ES2020` and `target` is set to `ES2019`.

Status: I am still investigating the cause for this necessity.

Workaround:
- Use synthetic default `import` statements (e.g. `import config from 'config'`) instead of proper ES2020 syntax (e.g. `import * as config from 'config'`).
- In `compilerOptions` for `tsc`, enable `allowSyntheticDefaultImports`. (Otherwise, `tsc` will report an error per conflict with ES2020 module spec.)
