import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface IModelXmlConverter {
  importXML(content: string): ModelDAO
  writeXml(dao: ModelDAO): string
}
