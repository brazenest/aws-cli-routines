/**
 * Type definitions pertaining to configuration variables specified in `config/default.yml`
 */

export type ConfigKey = string
export type ConfigItem = string | string[] | number | number[]
export type ConfigGroup = ConfigSet
export type ConfigValue = ConfigItem | ConfigGroup
export type ConfigSet = {
   [key: string]: ConfigValue
}
