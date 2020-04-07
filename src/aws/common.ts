import { execSync } from 'child_process'

import type { AwsStatement, AwsResponse } from '../types/aws/common.js'

export const executeStatement = async (statement: AwsStatement): Promise<AwsResponse> => {
  const response = execSync(statement.toString(), { encoding: 'utf8' })
  return (response.length) ? JSON.parse(response) : response
}
