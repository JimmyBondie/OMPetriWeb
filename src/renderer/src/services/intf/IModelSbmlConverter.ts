import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface IModelSBMLConverter {
  importSBML(content: string): ModelDAO
}
