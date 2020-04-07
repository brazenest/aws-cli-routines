/**
 * Type definitions for AWS EC2 CLI operations and data structures.
 */

import type { AwsSubcommandArgs } from './common.js'
import type { CidrAddress } from '../tcpip.js'

export type AwsEc2Command = (
    'describe-security-groups' |
    'revoke-security-group-egress' |
    'revoke-security-group-ingress' |
    'authorize-security-group-egress' |
    'authorize-security-group-ingress'
)
export type AwsEc2CommandArgs = AwsSubcommandArgs
export type AwsEc2CommandArgName = string
export type AwsEc2CommandArgValue = string | number

type AwsEc2SecurityGroupIpPermissionIpRange = {
    CidrIp: CidrAddress
}
type AwsEc2SecurityGroupIpPermissionIpv4Range = AwsEc2SecurityGroupIpPermissionIpRange
type AwsEc2SecurityGroupIpPermissionIpv6Range = AwsEc2SecurityGroupIpPermissionIpRange

type AwsEc2SecurityGroupIpPermission = {
    FromPort: number,
    IpProtocol: 'tcp' | 'udp'
    IpRanges: AwsEc2SecurityGroupIpPermissionIpv4Range[]
    Ipv6Ranges: AwsEc2SecurityGroupIpPermissionIpv6Range[]
    PrefixListIds: string[]
    ToPort: number
    UserIdGroupPairs: string[]
}

export type AwsEc2SecurityGroupId = string

type AwsEc2SecurityGroup = {
    Description: string
    GroupName: string
    IpPermissions: AwsEc2SecurityGroupIpPermission[]
    OwnerId: string
    GroupId: AwsEc2SecurityGroupId
    IpPermissionsEgress: AwsEc2SecurityGroupIpPermission[]
    VpcId: string
}

export type AwsEc2Response = AwsEc2DescribeSecurityGroupsResponse

export type AwsEc2DescribeSecurityGroupsResponse = {
    SecurityGroups: AwsEc2SecurityGroup[]
}
