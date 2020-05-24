import request from 'request-promise-native'
import { GithubRequestError } from '../types/github/index.js'
import config from '../config/index.js'

export const getGithubIpList = async () => {
  const { GITHUB_SERVICE_HREF, GITHUB_SERVICE_USERNAME } = config
  try {
    const response = await request({
      uri: GITHUB_SERVICE_HREF as string,
      headers: {
        'User-Agent': GITHUB_SERVICE_USERNAME,
      },
      json: true,
    })
    return response.git
  } catch (error) {
    throw new GithubRequestError(`Failed to retrieve Github IP address. (${error.number} ${error.message})`)
  }
}
