import { IElement } from '@renderer/entity/intf/IElement'

export class References extends Object {
  private _elementToFilterReferences: Map<IElement, Set<string>> = new Map<IElement, Set<string>>()
  private _filterToElementReferences: Map<string, IElement | undefined> = new Map<
    string,
    IElement | undefined
  >()
  private _pathSimulationExecutable: string = ''

  public get elementToFilterReferences(): Map<IElement, Set<string>> {
    return this._elementToFilterReferences
  }

  public get filterToElementReferences(): Map<string, IElement | undefined> {
    return this._filterToElementReferences
  }

  public get pathSimulationExecutable(): string {
    return this._pathSimulationExecutable
  }

  public set pathSimulationExecutable(pathSimulationExecutable: string) {
    this._pathSimulationExecutable = pathSimulationExecutable
  }

  public addElementReference(element: IElement, filter: string) {
    if (!this._elementToFilterReferences.has(element)) {
      this._elementToFilterReferences.set(element, new Set<string>())
    }
    this._elementToFilterReferences.get(element)?.add(filter)
  }

  public addFilterReference(filter: string, element?: IElement) {
    if (!this._filterToElementReferences.has(filter)) {
      this._filterToElementReferences.set(filter, element)
    }
  }
}
