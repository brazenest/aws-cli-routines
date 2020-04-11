import { runEc2Command } from './aws/ec2.js'
import type { AwsEc2SecurityGroupId, AwsEc2DescribeSecurityGroupsResponse, AwsEc2Command } from './types/aws/ec2.js'
import type { CidrAddress } from './types/tcpip.js'

export const retrieveSecurityGroupCidrAddresses = async (
  groupIds: AwsEc2SecurityGroupId[] = [],
) => {
  const response: AwsEc2DescribeSecurityGroupsResponse = await runEc2Command(
    'describe-security-groups',
    [
      ['group-ids', groupIds.join(',')],
    ],
  )
  const group = response.SecurityGroups[0]
  const ingresses = group.IpPermissions.map(({ IpRanges }) => (
    IpRanges.map(({ CidrIp }) => CidrIp)
  )).flat()
  const egresses = group.IpPermissionsEgress.map(({ IpRanges }) => (
    IpRanges.map(({ CidrIp }) => CidrIp)
  )).flat()

  const addresses = [
    ...ingresses,
    ...egresses,
  ]
    .filter((address, index, arr) => arr.indexOf(address) === index)

  return addresses
}

export const revokeSecurityGroupPolicies = async (
  securityGroupId: AwsEc2SecurityGroupId,
  cidrAddress: CidrAddress,
) => {
  const revocations = ([
    'revoke-security-group-egress',
    'revoke-security-group-ingress',
  ] as AwsEc2Command[])
    .map((ec2Command) => (
      runEc2Command(
        ec2Command,
        [
          ['group-id', securityGroupId],
          ['cidr', cidrAddress],
          ['protocol', 'tcp'],
          ['port', 22],
        ],
      )
    ))
  return Promise.allSettled(revocations)
}

export const authorizeSecurityGroupPolicies = async (
  securityGroupId: AwsEc2SecurityGroupId,
  cidrAddress: CidrAddress,
) => {
  const revocations = ([
    'authorize-security-group-egress',
    'authorize-security-group-ingress',
  ] as AwsEc2Command[])
    .map((ec2Command) => (
      runEc2Command(
        ec2Command,
        [
          ['group-id', securityGroupId],
          ['cidr', cidrAddress],
          ['protocol', 'tcp'],
          ['port', 22],
        ],
      )
    ))
  return Promise.allSettled(revocations)
}
