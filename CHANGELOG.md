# v0.1.0 (2020-04-08)

Initial release.

# v1.0.0 (2020-04-10)

First major release.

* Utilizes `winston` for console log messages, in lieu of `console.log` and `console.error`.
* Refactors code into separate methods for similar AWS CLI operations.
* Revises code style per lint specs.

# v1.1.0 (2020-05-23)

* Adds ability to whitelist a Github IP address for `git` actions.

# v1.1.1 (2020-05-24)

* Modifies Github IP retrieval method, to process the entire list of IPs instead of the first one exclusively.