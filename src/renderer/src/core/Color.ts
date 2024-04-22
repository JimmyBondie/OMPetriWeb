export class Color extends Object {
  private _description: string
  private _id: string

  constructor(id: string, description: string) {
    super()
    this._id = id
    this._description = description
  }

  public get description() {
    return this._description
  }

  public get id() {
    return this._id
  }

  public set description(description: string) {
    this._description = description
  }
}
