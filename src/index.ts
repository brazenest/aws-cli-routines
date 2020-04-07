/**
 * Entrypoint to execute the selected predefined routine.
 */

import type { PromiseRejection, PromiseResolution } from './types/promise-allsettled/index.js'
import { getCurrentPublicIp } from './ipify/index.js'
import { retrieveSecurityGroupCidrAddresses } from './methods.js'
import { ProgramFatalError } from './types/program.js'
import { runEc2Command } from './aws/ec2.js'
import type { CidrAddress, IpAddress } from './types/tcpip.js'
import type { AwsEc2Command, AwsEc2SecurityGroupId } from './types/aws/ec2.js'
import type { AwsResponse } from './types/aws/common.js'
import config from './config/index.js'

const securityGroupIds: AwsEc2SecurityGroupId[] = [
  config.AWS_SECURITY_GROUP_ID,
]
  .map((id) => id as string)

Promise.allSettled([
  retrieveSecurityGroupCidrAddresses(securityGroupIds),
  getCurrentPublicIp(),
])
  .then((results) => {
    const failures = (
      results.filter(
        ({ status }) => status === 'rejected',
      ) as PromiseRejection<Error>[]
    )
      .map(({ reason }) => reason)

    if (failures.length) {
      const errorMessage = 'Fatal error encountered. Some essential data could not be retrieved.'
      throw new ProgramFatalError(`${errorMessage}\n\nDetails:\n\n${failures}`)
    }

    const [
      { value: securityGroupResponseData },
      { value: currentIpAddress },
    ] = results as PromiseResolution<AwsResponse | any>[]

    const existingPolicyCidrAddresses: CidrAddress[] = securityGroupResponseData

    const revocations = ([
      'revoke-security-group-egress',
      'revoke-security-group-ingress',
    ] as AwsEc2Command[])
      .map((ec2Command) => (
        existingPolicyCidrAddresses.map((cidrAddress) => (
          runEc2Command(
            ec2Command,
            [
              ['group-id', config.AWS_SECURITY_GROUP_ID as string],
              ['cidr', cidrAddress],
              ['protocol', 'tcp'],
              ['port', 22],
            ],
          )
        ))
      )).flat()

    const authorizations = ([
      'authorize-security-group-ingress',
      'authorize-security-group-egress',
    ] as AwsEc2Command[])
      .map((ec2Command) => (
        runEc2Command(
          ec2Command,
          [
            ['group-id', config.AWS_SECURITY_GROUP_ID as string],
            ['cidr', `${currentIpAddress as IpAddress}/32` as CidrAddress],
            ['protocol', 'tcp'],
            ['port', 22],
          ],
        )
      ))

    return Promise.allSettled([
      ...revocations,
      ...authorizations,
    ])
  })
  .catch((error: ProgramFatalError) => console.error(error.message))
  .catch((error: Error) => console.error(`A general error occurred:\n\n${error}`))
