import { Graph } from '@renderer/graph/Graph'
import { IDataNode } from '../intf/IDataNode'
import { DataType } from '../intf/DataType'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { IArc } from '@renderer/entity/intf/IArc'
import { Parameter } from '@renderer/core/Parameter'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import i18n from '@renderer/main'
import { UnsupportedOperationException } from '@renderer/exception/UnsupportedOperationException'

export class DataCluster extends Object implements IDataNode {
  private _dataType: DataType
  private _description: string = ''
  private _graph: Graph
  private _id: string
  private _shapes: Set<IGraphElement>

  public constructor(id: string) {
    super()
    this._dataType = DataType.CLUSTER
    this._graph = new Graph()
    this._id = id
    this._shapes = new Set<IGraphElement>()
  }

  public get arcsIn(): Array<IArc> {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get arcsOut(): Array<IArc> {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get constant(): boolean {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get description(): string {
    return this._description
  }

  public get disabled(): boolean {
    let isDisabled: boolean = true
    for (const element of this._graph.nodes) {
      isDisabled = element.disabled
      if (!isDisabled) {
        // if at least one node is not disabled, show shape as enabled
        break
      }
    }
    return isDisabled
  }

  public get elementType(): ElementType {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get graph(): Graph {
    return this._graph
  }

  public get id(): string {
    return this._id
  }

  public get isSticky(): boolean {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get labelText(): string {
    if (this._shapes.size == 0) {
      return ''
    }
    return (this._shapes.values().next().value as IGraphNode).labelText
  }

  public get localParameters(): Array<Parameter> {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get relatedParameters(): Set<Parameter> {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get shapes(): Set<IGraphElement> {
    return this._shapes
  }

  public get type(): DataType {
    return this._dataType
  }

  public set constant(_: boolean) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public set description(description: string) {
    this._description = description
  }

  public set disabled(disabled: boolean) {
    for (const element of this._graph.nodes) {
      element.disabled = disabled
    }
    for (const element of this._graph.connections) {
      element.disabled = disabled
    }
    this.updateShape()
  }

  public set id(id: string) {
    this._id = id
  }

  public set isSticky(_: boolean) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public set labelText(labelText: string) {
    for (const shape of this._shapes) {
      ;(shape as IGraphNode).labelText = labelText
    }
  }

  public addLocalParameter(_: Parameter) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public equals(element: IElement): boolean {
    return (
      element instanceof DataCluster &&
      this._graph == element._graph &&
      this._shapes == element._shapes
    )
  }

  public getLocalParameter(_: string): Parameter {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  private updateShape() {
    const isDisabled: boolean = this.disabled
    for (const shape of this._shapes) {
      shape.disabled = isDisabled
    }
  }
}
