import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { DataType } from '../intf/DataType'
import { IDataArc } from '../intf/IDataArc'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { ArcType } from '@renderer/entity/intf/IArc'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import { Parameter } from '@renderer/core/Parameter'
import { Weight } from '@renderer/core/Weight'
import { Color } from '@renderer/core/Color'
import { UnsupportedOperationException } from '@renderer/exception/UnsupportedOperationException'
import { IDataNode } from '../intf/IDataNode'
import i18n from '@renderer/main'

export class DataClusterArc extends Object implements IDataArc {
  private _dataType: DataType
  private _description: string = ''
  private _id: string
  private _shapes: Set<IGraphElement> = new Set<IGraphElement>()
  private _source: IDataNode
  private _storedArcs: Map<string, IGraphArc> = new Map<string, IGraphArc>()
  private _target: IDataNode

  public constructor(id: string, source: IDataNode, target: IDataNode) {
    super()
    this._dataType = DataType.CLUSTERARC
    this._id = id
    this._source = source
    this._target = target
  }

  public get arcType(): ArcType {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get conflictResolutionValue(): number {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get description(): string {
    return this._description
  }

  public get disabled(): boolean {
    let isDisabled: boolean = true
    for (const arc of this._storedArcs.values()) {
      isDisabled = arc.data.disabled
      if (!isDisabled) {
        // if at least one arc is not disabled, show shape as enabled
        break
      }
    }
    return isDisabled
  }

  public get elementType(): ElementType {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get id(): string {
    return this._id
  }

  public get isSticky(): boolean {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public get labelText(): string {
    return ''
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

  public get source(): IDataNode {
    return this._source
  }

  public get storedArcs(): Map<string, IGraphArc> {
    return this._storedArcs
  }

  public get target(): IDataNode {
    return this._target
  }

  public get type(): DataType {
    return this._dataType
  }

  public get weights(): Array<Weight> {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public set arcType(_: ArcType) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public set conflictResolutionValue(_: number) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public set description(description: string) {
    this._description = description
  }

  public set disabled(disabled: boolean) {
    for (const arc of this._storedArcs.values()) {
      arc.data.disabled = disabled
    }
  }

  public set id(id: string) {
    this._id = id
  }

  public set isSticky(_: boolean) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public set labelText(_: string) {}

  public addLocalParameter(_: Parameter) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public addWeight(_: Weight) {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public equals(element: IElement): boolean {
    return element instanceof DataClusterArc && this._shapes == element.shapes
  }

  public getLocalParameter(_: string): Parameter {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }

  public getWeight(_: Color): Weight {
    throw new UnsupportedOperationException(i18n.global.t('NotSupported'))
  }
}
