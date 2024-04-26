import { Guid } from 'guid-typescript'
import i18n from '@renderer/main'
import { Color } from '@renderer/core/Color'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IModelService } from '../intf/IModelService'
import { CustomService } from '../intf'
import { IElement } from '@renderer/entity/intf/IElement'
import { DataType } from '@renderer/data/intf/DataType'
import { GraphNode } from '@renderer/graph/impl/GraphNode'
import { GraphArc } from '@renderer/graph/impl/GraphArc'

export class ModelService extends CustomService implements IModelService {
  private readonly DEFAULT_COLOR: Color = new Color('WHITE', 'Default color')

  private _models: Array<ModelDAO> = new Array<ModelDAO>()

  public get models(): Array<ModelDAO> {
    return this._models
  }

  addArc(dao: ModelDAO, arc: GraphArc) {
    if (arc && arc.data && arc.data.type != DataType.CLUSTERARC) {
      dao.model.addElement(arc.data)
    }
    dao.graph.addConnection(arc)
  }

  public addElement(dao: ModelDAO, element: IElement) {
    dao.model.addElement(element)
  }

  public addModel(newModel: ModelDAO): ModelDAO {
    const model: ModelDAO | undefined = this._models.find((model: ModelDAO) => {
      return model && model.id == newModel.id
    })

    if (model) {
      return model
    } else {
      this._models.push(newModel)
      return newModel
    }
  }

  public addNode(dao: ModelDAO, node: GraphNode) {
    if (node && node.data && node.data.type != DataType.CLUSTER) {
      dao.model.addElement(node.data)
    }
    dao.graph.addNode(node)
  }

  public newModel(): ModelDAO {
    const dao: ModelDAO = new ModelDAO(Guid.create().toString())
    dao.name = i18n.global.t('Untitled')
    dao.model.addColor(this.DEFAULT_COLOR)
    dao.hasChanges = true
    this._models.push(dao)
    return dao
  }

  public removeModel(model: ModelDAO) {
    const index = this._models.indexOf(model)
    if (index >= 0) {
      this._models.splice(index, 1)
    }
  }
}