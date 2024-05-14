import { Model } from '@renderer/core/Model'
import { Graph } from '@renderer/graph/Graph'

export class ModelDAO extends Object {
  private _author: string = ''
  private _creationDateTime: Date = new Date()
  private _description: string = ''
  private _graph: Graph = new Graph()
  private _hasChanges: boolean = false
  private _id: string
  private _model: Model = new Model()
  private _name: string = ''
  private _nextClusterId: number = 1
  private _nextNodeId: number = 1
  private _nextPlaceId: number = 1
  private _nextTransitionId: number = 1
  private _scalePower: number = 0

  constructor(id: string) {
    super()
    this._id = id
    this.clear()
  }

  public get author(): string {
    return this._author
  }

  public get creationDateTime(): Date {
    return this._creationDateTime
  }

  public get description(): string {
    return this._description
  }

  public get graph(): Graph {
    return this._graph
  }

  public get hasChanges(): boolean {
    return this._hasChanges
  }

  public get id(): string {
    return this._id
  }

  public get model(): Model {
    return this._model
  }

  public get name(): string {
    return this._name
  }

  public get nextClusterId(): number {
    return this._nextClusterId++
  }

  public get nextNodeId(): number {
    return this._nextNodeId++
  }

  public get nextPlaceId(): number {
    return this._nextPlaceId++
  }

  public get nextTransitionId(): number {
    return this._nextTransitionId++
  }

  public get scalePower(): number {
    return this._scalePower
  }

  public set author(author: string) {
    this._author = author
  }

  public set creationDateTime(creationDateTime: Date) {
    this._creationDateTime = creationDateTime
  }

  public set description(description: string) {
    this._description = description
  }

  public set hasChanges(hasChanges: boolean) {
    this._hasChanges = hasChanges
  }

  public set name(name: string) {
    this._name = name
  }

  public set nextClusterId(nextClusterId: number) {
    this._nextClusterId = nextClusterId++
  }

  public set nextNodeId(nextNodeId: number) {
    this._nextNodeId = nextNodeId++
  }

  public set nextPlaceId(nextPlaceId: number) {
    this._nextPlaceId = nextPlaceId++
  }

  public set nextTransitionId(nextTransitionId: number) {
    this._nextTransitionId = nextTransitionId++
  }

  public set scalePower(scalePower: number) {
    this.scalePower = scalePower
  }

  public clear() {
    this._model.clear()
    this._nextClusterId = 1
    this._nextNodeId = 1
    this._nextPlaceId = 1
    this._nextTransitionId = 1
  }
}
