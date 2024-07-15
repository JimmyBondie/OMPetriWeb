import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomService } from '../intf'
import { IFactoryService } from '../intf/IFactoryService'
import { DataType } from '@renderer/data/intf/DataType'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { Token } from '@renderer/core/Token'
import { GraphPlace } from '@renderer/graph/impl/GraphPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { GraphTransition } from '@renderer/graph/impl/GraphTransition'
import i18n from '@renderer/main'
import { PlaceType } from '@renderer/entity/impl/Place'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { Color } from '@renderer/core/Color'
import { DataException } from './Exceptions'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { DataArc } from '@renderer/data/impl/DataArc'
import { Weight } from '@renderer/core/Weight'
import { GraphArc } from '@renderer/graph/impl/GraphArc'
import { ArcType } from '@renderer/entity/intf/IArc'
import { INode } from '@renderer/entity/intf/INode'
import { DateTime } from 'luxon'
import { Guid } from 'guid-typescript'

export class FactoryService extends CustomService implements IFactoryService {
  private DEFAULT_COLOUR: Color = new Color('WHITE', 'Default colour')

  private PREFIX_ID_GRAPHNODE: string = 'N'
  private PREFIX_ID_PLACE: string = 'P'
  private PREFIX_ID_TRANSITION: string = 'T'

  private defaultArcType: ArcType = ArcType.NORMAL

  public get colorDefault(): Color {
    return this.DEFAULT_COLOUR
  }

  public createConnection(source: IGraphNode, target: IGraphNode, dataArc?: IDataArc): IGraphArc {
    /**
     * Create data.
     */
    let id: string = this.getArcId(source.data, target.data)
    if (!dataArc) {
      dataArc = new DataArc(id, source.data, target.data, this.defaultArcType)
      dataArc.addWeight(new Weight(this.DEFAULT_COLOUR))
    }

    /**
     * Creating shape.
     */
    id = this.getConnectionId(source, target)
    return new GraphArc(id, source, target, dataArc)
  }

  public createDao(): ModelDAO {
    const dao: ModelDAO = new ModelDAO(Guid.create().toString())
    if (window.api) {
      dao.author = window.api.userName
    } else {
      dao.author = i18n.global.t('Guest')
    }
    dao.creationDateTime = DateTime.now().toJSDate()
    dao.name = i18n.global.t('Untitled')
    dao.model.addColor(this.DEFAULT_COLOUR)
    dao.hasChanges = false
    return dao
  }

  public createNode(
    modelDao: ModelDAO,
    type:
      | { dataType: DataType.PLACE; elemType: PlaceType }
      | { dataType: DataType.TRANSITION; elemType: TransitionType },
    posX: number,
    posY: number
  ): IGraphNode {
    let shape: IGraphNode
    switch (type.dataType) {
      case DataType.PLACE: {
        const place: DataPlace = new DataPlace(this.getPlaceId(modelDao), type.elemType)
        place.addToken(new Token(this.DEFAULT_COLOUR))
        shape = new GraphPlace(this.getGraphNodeId(modelDao), place)
        break
      }

      case DataType.TRANSITION: {
        const transition: DataTransition = new DataTransition(
          this.getTransitionId(modelDao),
          type.elemType
        )
        shape = new GraphTransition(this.getGraphNodeId(modelDao), transition)
        break
      }

      default: {
        throw new DataException(i18n.global.t('CannotCreateElement'))
      }
    }

    shape.xCoordinate = posX
    shape.yCoordinate = posY

    return shape
  }

  public getArcId(source: INode, target: INode): string {
    return source.id + '_' + target.id
  }

  public getConnectionId(source: IGraphNode, target: IGraphNode): string {
    return source.id + '_' + target.id
  }

  public getGraphNodeId(dao: ModelDAO): string {
    return this.PREFIX_ID_GRAPHNODE + dao.nextNodeId
  }

  public getPlaceId(dao: ModelDAO): string {
    return this.PREFIX_ID_PLACE + dao.nextPlaceId
  }

  public getTransitionId(dao: ModelDAO): string {
    return this.PREFIX_ID_TRANSITION + dao.nextTransitionId
  }
}
