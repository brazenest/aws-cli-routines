import { getConfigItem, getConfigGroup } from './lib.js'

import type { ConfigGroup, ConfigSet, ConfigKey } from '../types/config.js'

/*
Constants */

export const CONFIG_ENV_VAR_REGEX = /[^a-zA-Z0-9-+/]+/g

export const AWS_CLI_EXECUTABLE_NAME = 'aws'
export const AWS_CLI_STATEMENT_TOKEN_DELIMITER = ' '
export const AWS_EC2_SERVICE_NAME = 'ec2'

/*
Env vars (set in `config/default.yml`) */

const CONFIG_GROUPS = getConfigItem('config-groups') as ConfigKey[]

export const ENV_VARS: ConfigSet = (() => {
  const result: ConfigSet = {}
  CONFIG_GROUPS.forEach((key) => {
    const group: ConfigGroup = getConfigGroup(key)
    Object.entries(group).forEach(([name, value]) => {
      const keyComposite = `${key}_${name}`
      result[keyComposite] = value
      process.env[keyComposite] = (value as string).replace(CONFIG_ENV_VAR_REGEX, '')
    })
  })
  return result
})()

export default ENV_VARS
