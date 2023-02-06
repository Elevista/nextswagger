import { AxiosRequestConfig } from 'axios/index'
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
