import { V2T, V3T, V2spec, V3spec, TemplateCommon } from 'tswagger'
import { Options } from './index'
export type NextTemplateOptions = Options & { relTypePath: string }
interface NextTemplate extends TemplateCommon { hasAxiosConfig: boolean }

function axiosArrowFn (args: string, returnType: string, methodType: string, params: string) {
  return `(${args}): $R<${returnType}> => _('${methodType}')(${params})`
}
function pluginTemplate (this: NextTemplate, { object }: { object: string }) {
  const { importTypes, multipart, noInspect } = this

  const importConfig = this.hasAxiosConfig
    ? `import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
`
    : ''
  const findAxiosConfig = importConfig ? '[publicRuntimeConfig?.nextswagger].flat().find(x => x?.pluginName === \'deus\')?.axiosConfig' : ''
  return `
${noInspect}
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
${importConfig}${importTypes}
export const $axios = Axios.create(${findAxiosConfig})
type $R<T> = Promise<T & { $response: AxiosResponse }>
${this.exportFormat(object)}
const _ = (method: string) => (...args: any) => ($axios as any)[method](...args).then((x: AxiosResponse) => Object.defineProperty(x.data, '$response', {value: x}))
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
