import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomService } from '../intf'
import { IFactoryService } from '../intf/IFactoryService'
import { DataType } from '@renderer/data/intf/DataType'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { CustomError } from '@renderer/utils/CustomError'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { Token } from '@renderer/core/Token'
import { GraphPlace } from '@renderer/graph/impl/GraphPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { GraphTransition } from '@renderer/graph/impl/GraphTransition'
import i18n from '@renderer/main'
import { PlaceType } from '@renderer/entity/impl/Place'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { Color } from '@renderer/core/Color'

export class DataException extends CustomError {}

export class FactoryService extends CustomService implements IFactoryService {
  private DEFAULT_COLOUR: Color = new Color('WHITE', 'Default colour')

  private PREFIX_ID_GRAPHNODE: string = 'N'
  private PREFIX_ID_PLACE: string = 'P'
  private PREFIX_ID_TRANSITION: string = 'T'

  private defaultPlaceType: PlaceType = PlaceType.CONTINUOUS
  private defaultTransitionType: TransitionType = TransitionType.CONTINUOUS

  public createNode(modelDao: ModelDAO, type: DataType, posX: number, posY: number): IGraphNode {
    let shape: IGraphNode
    switch (type) {
      case DataType.PLACE: {
        const place: DataPlace = new DataPlace(this.getPlaceId(modelDao), this.defaultPlaceType)
        place.addToken(new Token(this.DEFAULT_COLOUR))
        shape = new GraphPlace(this.getGraphNodeId(modelDao), place)
        break
      }

      case DataType.TRANSITION: {
        const transition: DataTransition = new DataTransition(
          this.getTransitionId(modelDao),
          this.defaultTransitionType
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
