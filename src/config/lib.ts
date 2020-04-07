import config from 'config'

import type {
  ConfigKey, ConfigGroup, ConfigItem, ConfigValue,
} from '../types/config.js'

const getConfigValue = (key: ConfigKey): ConfigValue => config.get(key)
export const getConfigItem = (key: ConfigKey): ConfigItem => getConfigValue(key) as ConfigItem
export const getConfigGroup = (key: ConfigKey): ConfigGroup => getConfigValue(key) as ConfigGroup
