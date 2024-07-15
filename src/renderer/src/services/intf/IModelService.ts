import { Color } from '@renderer/core/Color'
import { Function } from '@renderer/core/Function'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataArc } from '@renderer/data/impl/DataArc'
import { DataCluster } from '@renderer/data/impl/DataCluster'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { DataType } from '@renderer/data/intf/DataType'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { PlaceType } from '@renderer/entity/impl/Place'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { ArcType } from '@renderer/entity/intf/IArc'
import { IElement } from '@renderer/entity/intf/IElement'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export interface IModelService {
  readonly models: Array<ModelDAO>

  addArc(dao: ModelDAO, arc: IGraphArc): void
  addElement(dao: ModelDAO, element: IElement): void
  addModel(newModel: ModelDAO): ModelDAO
  addNode(dao: ModelDAO, node: IGraphNode): void
  changeArcType(dao: ModelDAO, arc: DataArc, type: ArcType): void
  changeElementId(
    dao: ModelDAO,
    element: IDataElement,
    elementIdNew: string,
    reverse?: boolean
  ): void
  changePlaceType(dao: ModelDAO, place: DataPlace, type: PlaceType): void
  changeTransitionType(dao: ModelDAO, transition: DataTransition, type: TransitionType): void
  connect(dao: ModelDAO, source: IGraphNode, target: IGraphNode): IGraphArc
  create(
    dao: ModelDAO,
    cluster: DataCluster | null,
    type:
      | { dataType: DataType.PLACE; elemType: PlaceType }
      | { dataType: DataType.TRANSITION; elemType: TransitionType },
    posX: number,
    posY: number
  ): IGraphNode
  newModel(): ModelDAO
  removeElement(dao: ModelDAO, element: IGraphElement): void
  removeModel(model: ModelDAO): void
  setElementFunction(dao: ModelDAO, element: IElement, func: Function, color?: Color): void
}
