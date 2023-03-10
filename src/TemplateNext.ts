import { V2T, V3T, V2spec, V3spec, TemplateCommon } from 'tswagger'
import { NexTSwaggerOptions as Options } from './index'
export type NextTemplateOptions = Options & { relTypePath: string }
interface NextTemplate extends TemplateCommon { hasAxiosConfig: boolean }

function axiosArrowFn (args: string, returnType: string, methodType: string, params: string) {
  return `(${args}): $R<${returnType}> => _('${methodType}', ${params})`
}
function pluginTemplate (this: NextTemplate, { object }: { object: string }) {
  const { importTypes, multipart, noInspect, options: { pluginName }, hasAxiosConfig, exportCode } = this

  const importConfig = hasAxiosConfig
    ? `import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
`
    : ''
  const axiosConfig = hasAxiosConfig ? `[publicRuntimeConfig?.nextswagger].flat().find(x => x?.pluginName === '${pluginName}')?.axiosConfig || {}` : '{}'
  return `
${noInspect}
import Axios, { AxiosStatic, AxiosRequestConfig, AxiosResponse } from 'axios'
${importConfig}${importTypes}
export interface $customExtendResponse {}
type $R<T> = Promise<T> & { readonly response: Promise<AxiosResponse<T> & $customExtendResponse> }
export const $axiosConfig: Required<Parameters<AxiosStatic['create']>>[0] = ${axiosConfig}
const $ep = (_: any) => (${object})
${exportCode}
${multipart}
`.trimStart()
}
export class V2 extends V2T {
  protected hasAxiosConfig: boolean
  constructor (spec: V2spec, options: NextTemplateOptions) {
    super(spec, options)
    this.hasAxiosConfig = !!options.axiosConfig
    this.pluginTemplate = pluginTemplate
    this.axiosArrowFn = axiosArrowFn
  }
}

export class V3 extends V3T {
  protected hasAxiosConfig: boolean
  constructor (spec: V3spec, options: NextTemplateOptions) {
    super(spec, options)
    this.hasAxiosConfig = !!options.axiosConfig
    this.pluginTemplate = pluginTemplate
    this.axiosArrowFn = axiosArrowFn
  }
}
