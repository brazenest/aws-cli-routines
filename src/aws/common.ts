import { execSync } from 'child_process'
import logger from '../logging.js'

import type { AwsStatement, AwsResponse } from '../types/aws/common.js'

export const executeStatement = async (statement: AwsStatement): Promise<AwsResponse> => {
  const statementAsString = statement.toString()
  logger.info(`Executing ${statementAsString} ...`)
  const response = execSync(statementAsString, { encoding: 'utf8' })
  return (response.length) ? JSON.parse(response) : response
}
