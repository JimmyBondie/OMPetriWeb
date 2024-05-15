import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface IModelSbmlConverter {
  importSbml(content: string): ModelDAO
}
