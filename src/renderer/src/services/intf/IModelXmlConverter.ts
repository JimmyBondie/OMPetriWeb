import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface IModelXmlConverter {
  importXML(content: string): ModelDAO | null
}
