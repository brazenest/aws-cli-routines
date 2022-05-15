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

# v1.2.0 (2020-05-29)

* Modified AWS statement execution routine so it operates in truly asynchonous fashion.

# v1.2.1 (2020-09-03)

* Modifies environment variable character exclusion regex, as AWS secret key values may contain some non-alphanumeric characters.
* Excludes Visual Studio Code project-level configuration files from consideration during commits, as such files are specific to the user's environmental preferences.

# v1.2.2 (2022-05-15)

* Modifies `default.yml.example` config file, to reflect parameter
requirements for GitHug API queries.
