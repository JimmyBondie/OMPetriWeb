import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface IModelXMLConverter {
  importXML(content: string): ModelDAO
  writeXML(dao: ModelDAO): string
}
