import { runEc2Command } from './aws/ec2.js'
import type { AwsEc2SecurityGroupId, AwsEc2DescribeSecurityGroupsResponse } from './types/aws/ec2.js'

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
  const ingresses = group.IpPermissions.map(({ IpRanges }) => IpRanges.map(({ CidrIp }) => CidrIp)).flat()
  const egresses = group.IpPermissionsEgress.map(({ IpRanges }) => IpRanges.map(({ CidrIp }) => CidrIp)).flat()

  const addresses = [
    ...ingresses,
    ...egresses,
  ]
    .filter((address, index, arr) => arr.indexOf(address) === index)

  return addresses
}
