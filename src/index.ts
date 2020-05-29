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
import logger from './logging.js'
import { getGithubIpList } from './github/index.js'

const securityGroupId: AwsEc2SecurityGroupId = config.AWS_SECURITY_GROUP_ID as string

Promise.allSettled([
  retrieveSecurityGroupCidrAddresses([securityGroupId]),
  getCurrentPublicIp(),
  getGithubIpList(),
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
      { value: currentGithubGitIpAddresses },
    ] = results as PromiseResolution<AwsResponse | any>[]

    const existingPolicyCidrAddresses: CidrAddress[] = securityGroupResponseData
    const currentCidrAddress = `${currentIpAddress as IpAddress}/32` as CidrAddress

    const revocations = existingPolicyCidrAddresses.map((cidrAddress) => (
      revokeSecurityGroupPolicies(securityGroupId, cidrAddress)
    ))
    
    const authorizations = [
      currentCidrAddress,
      ...currentGithubGitIpAddresses,
    ].map((cidrAddress) => (
      authorizeSecurityGroupPolicies(securityGroupId, cidrAddress)
    ))

    return Promise.allSettled([
      ...revocations,
      ...authorizations,
    ])
  })
  .catch((error: ProgramFatalError) => logger.error(error.message))
  .catch((error: Error) => logger.error(`A general error occurred:\n\n${error}`))
