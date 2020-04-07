/**
 * Type definitions for AWS CLI general operations and data structures.
 */

import type { AwsEc2Command, AwsEc2CommandArgName, AwsEc2CommandArgValue, AwsEc2Response } from './ec2.js'

import { AWS_CLI_EXECUTABLE_NAME, AWS_CLI_STATEMENT_TOKEN_DELIMITER } from '../../config/index.js'

export type AwsCommand = (
    'ec2'
)
type AwsSubcommand = (
    AwsEc2Command
)
type AwsSubcommandArgName = (
    AwsEc2CommandArgName
)
type AwsSubcommandArgValue = (
    AwsEc2CommandArgValue
)
export type AwsSubcommandArgTuple = [
    AwsSubcommandArgName,
    AwsSubcommandArgValue?,
]
export type AwsSubcommandArgs = AwsSubcommandArgTuple[]

export class AwsStatement {
    executableName = AWS_CLI_EXECUTABLE_NAME
    command: AwsCommand
    subcommand: AwsSubcommand
    subcommandArgs: AwsSubcommandArgs

    constructor(
      command: AwsCommand,
      subcommand: AwsSubcommand,
      subcommandArgs: AwsSubcommandArgs = [],
    ) {
      this.command = command
      this.subcommand = subcommand
      this.subcommandArgs = subcommandArgs
    }

    toString = () => (
      [
        this.executableName,
        this.command,
        this.subcommand,
        this.subcommandArgs.map((tuple) => (
          `--${tuple.join(AWS_CLI_STATEMENT_TOKEN_DELIMITER).trim()}`
        )).join(AWS_CLI_STATEMENT_TOKEN_DELIMITER),
      ].join(AWS_CLI_STATEMENT_TOKEN_DELIMITER).trim()
    )
}

export type AwsResponse = AwsEc2Response
