/**
 * Entrypoint to execute the selected predefined routine.
 */

import type { PromiseRejection, PromiseResolution } from './types/promise-allsettled/index.js'
import { getCurrentPublicIp } from './ipify/index.js'
import { retrieveSecurityGroupCidrAddresses, revokeSecurityGroupPolicies, authorizeSecurityGroupPolicies } from './methods.js'
import { ProgramFatalError } from './types/program.js'
import type { CidrAddress, IpAddress } from './types/tcpip.js'
import type { AwsEc2SecurityGroupId } from './types/aws/ec2.js'
import type { AwsResponse } from './types/aws/common.js'
import config from './config/index.js'

const securityGroupId: AwsEc2SecurityGroupId = config.AWS_SECURITY_GROUP_ID as string

Promise.allSettled([
  retrieveSecurityGroupCidrAddresses([securityGroupId]),
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
    const currentCidrAddress = `${currentIpAddress as IpAddress}/32` as CidrAddress

    return Promise.allSettled([
        existingPolicyCidrAddresses.map((cidrAddress) => (
        revokeSecurityGroupPolicies(securityGroupId, cidrAddress)
      )),
      authorizeSecurityGroupPolicies(securityGroupId, currentCidrAddress),
    ].flat())
  })
  .catch((error: ProgramFatalError) => console.error(error.message))
  .catch((error: Error) => console.error(`A general error occurred:\n\n${error}`))
