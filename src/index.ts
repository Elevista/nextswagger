import { AxiosRequestConfig } from 'axios'
import { NextConfig as OriginNextConfig } from 'next'
export * from 'tswagger'
export interface NexTSwaggerCliOptions {
  src: string
  pluginsDir: string
  pluginName: string
  exportName: string
  typePath: string
  basePath: string
  skipHeader: boolean
  form?: 'underscore'
}
export type NexTSwaggerOptions = NexTSwaggerCliOptions & { axiosConfig?: AxiosRequestConfig }
export type RuntimeConfig = { nextswagger?: Partial<NexTSwaggerOptions>[] | Partial<NexTSwaggerOptions> }
export type NextConfig = OriginNextConfig & { serverRuntimeConfig?: RuntimeConfig, publicRuntimeConfig?: RuntimeConfig }
