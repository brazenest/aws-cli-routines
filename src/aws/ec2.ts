import type { AwsEc2Command, AwsEc2CommandArgs, AwsEc2Response } from '../types/aws/ec2.js'
import { AwsStatement } from '../types/aws/common.js'
import { AWS_EC2_SERVICE_NAME } from '../config/index.js'
import { executeStatement } from './common.js'

export const runEc2Command = async (
  command: AwsEc2Command,
  commandArgs: AwsEc2CommandArgs = [],
): Promise<AwsEc2Response> => (
  executeStatement(
    new AwsStatement(AWS_EC2_SERVICE_NAME, command, commandArgs),
  )
)
