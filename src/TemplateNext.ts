import { V2T, V3T, V2spec, V3spec, TemplateCommon } from 'tswagger'
import { NexTSwaggerOptions as Options } from './index'
export type NextTemplateOptions = Options & { relTypePath: string }
interface NextTemplate extends TemplateCommon { hasAxiosConfig: boolean }

function axiosArrowFn (args: string, returnType: string, methodType: string, params: string) {
  return `(${args}): $R<${returnType}> => _('${methodType}', ${params})`
}
function pluginTemplate (this: NextTemplate, { object }: { object: string }) {
  const { importTypes, multipart, noInspect, options: { pluginName } } = this

  const importConfig = this.hasAxiosConfig
    ? `import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
`
    : ''
  const exportAxiosConfig = this.hasAxiosConfig ? `\nexport const $axiosConfig: AxiosRequestConfig = [publicRuntimeConfig?.nextswagger].flat().find(x => x?.pluginName === '${pluginName}')?.axiosConfig` : ''
  return `
${noInspect}
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
${importConfig}${importTypes}${exportAxiosConfig}
type $R<T> = Promise<T & { readonly $response: AxiosResponse }>
const $ep = (_: any) => (${object})
${this.exportFormat('')}($axios = Axios.create(${exportAxiosConfig ? '$axiosConfig' : ''})) => $ep((method: string, ...args: any) => ($axios as any)[method](...args).then((x: AxiosResponse) => Object.defineProperty(x.data, '$response', {value: x})))
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
