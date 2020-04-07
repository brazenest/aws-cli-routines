import request from 'request-promise-native'
import { IpifyRequestError } from '../types/ipify/index.js'
import config from '../config/index.js'

export const getCurrentPublicIp = async () => {
  const { IP_RESOLVER_SERVICE_HREF } = config
  try {
    return request({
      uri: IP_RESOLVER_SERVICE_HREF as string,
      json: true,
    })
  } catch (error) {
    throw new IpifyRequestError(`Failed to retrieve current IP address. (${error.number} ${error.message})`)
  }
}
