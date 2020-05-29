import util from 'util'
import { exec } from 'child_process'
import logger from '../logging.js'

import type { AwsStatement, AwsResponse } from '../types/aws/common.js'

const execAsync = util.promisify(exec)

export const executeStatement = async (statement: AwsStatement): Promise<AwsResponse> => {
  const statementAsString = statement.toString()
  logger.info(`Executing ${statementAsString} ...`)
  const { stdout: response } = await execAsync(statementAsString, { encoding: 'utf8' })
  return (response.length) ? JSON.parse(response) : response
}
