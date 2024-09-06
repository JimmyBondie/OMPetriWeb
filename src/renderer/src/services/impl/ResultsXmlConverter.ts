import { Simulation } from '@renderer/result/Simulation'
import { IResultsXMLConverter } from '../intf/IResultsXMLConverter'
import { BaseXMLConverter } from './BaseXMLConverter'
import { ResultSet } from '@renderer/result/ResultSet'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { References } from '@renderer/core/References'
import { DateTime } from 'luxon'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import { CustomError } from '@renderer/utils/CustomError'
import i18n from '@renderer/main'
import { DataArc } from '@renderer/data/impl/DataArc'
import { ArcType } from '@renderer/entity/intf/IArc'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { Place, PlaceType } from '@renderer/entity/impl/Place'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { Transition, TransitionType } from '@renderer/entity/impl/Transition'

export class ResultsXMLConverterError extends CustomError {}

export class ResultsXMLConverter extends BaseXMLConverter implements IResultsXMLConverter {
  private readonly formatDateTime: string = 'yy-MM-dd HH:mm:ss'

  private readonly attrAuthor: string = 'author'
  private readonly attrDateTime: string = 'dateTime'
  private readonly attrId: string = 'id'
  private readonly attrName: string = 'name'
  private readonly attrType: string = 'type'
  private readonly attrSubtype: string = 'subtype'
  private readonly attrShow: string = 'showing'

  private readonly tagData: string = 'Data'
  private readonly tagElement: string = 'Element'
  private readonly tagModel: string = 'Model'
  private readonly tagModels: string = 'Models'
  private readonly tagSimulation: string = 'Simulation'
  private readonly tagSimulations: string = 'Simulations'
  private readonly tagResults: string = 'Results'
  private readonly tagReferences: string = 'References'
  private readonly tagVariable: string = 'Variable'

  public exportResultSets(resultSets: Array<ResultSet>): string {
    const dom: XMLDocument = document.implementation.createDocument('', '')

    const models: Element = dom.createElement(this.tagModels)
    for (const resultSet of resultSets) {
      const simulation: Element = this.writeSimulation(resultSet.simulation, dom, models)
      const elements: Element = simulation.getElementsByTagName(this.tagReferences)[0]
      const results = simulation.getElementsByTagName(this.tagResults)[0]

      let element: Element | undefined = undefined
      // Check if element exists.
      this.readGroup<ResultSet>(
        resultSet,
        elements,
        '',
        '*',
        (resultSet: ResultSet, node: Element) => {
          if (node.getAttribute(this.attrId) == resultSet.element.id) {
            element = node
          }
        }
      )

      if (!element) {
        element = this.writeElement(dom.createElement(this.tagElement), resultSet.element)
        elements.appendChild(element)
      }

      // Append data.
      element.appendChild(this.writeVariable(dom, resultSet.variable, resultSet.shown))
      results.appendChild(this.writeDataValues(dom, resultSet.variable, resultSet.data))
    }
    dom.appendChild(models)

    return this.xmlToString(dom)
  }

  public exportSimulationResults(simulationResults: Array<Simulation>): string {
    const dom: XMLDocument = document.implementation.createDocument('', '')

    const models: Element = dom.createElement(this.tagModels)
    for (const simulationResult of simulationResults) {
      const simulation: Element = this.writeSimulation(simulationResult, dom, models)
      const elements: Element = simulation.getElementsByTagName(this.tagReferences)[0]
      const results: Element = simulation.getElementsByTagName(this.tagResults)[0]

      for (const elem of simulationResult.elements) {
        let element: Element | undefined = undefined

        // Check if element exists.
        this.readGroup<IElement>(elem, elements, '', '*', (elem: IElement, node: Element) => {
          if (node.getAttribute(this.attrId) == elem.id) {
            element = node
          }
        })

        if (!element) {
          element = this.writeElement(dom.createElement(this.tagElement), elem)
          elements.appendChild(element)
        }

        for (const variable of simulationResult.getElementFilter(elem)) {
          element.appendChild(this.writeVariable(dom, variable, false))
          // skip arcs, data is stored in places, only need reference
          if (elem.elementType != ElementType.ARC) {
            results.appendChild(
              this.writeDataValues(dom, variable, simulationResult.getData(variable))
            )
          }
        }
      }
    }
    dom.appendChild(models)

    return this.xmlToString(dom)
  }

  public importXML(content: string): Array<Simulation> {
    const xmlDoc: XMLDocument = this.parser.parseFromString(content, 'text/xml')
    const daos: Array<ModelDAO> = new Array<ModelDAO>()
    const simulations: Array<Simulation> = new Array<Simulation>()

    // Models.
    this.readGroup<undefined>(
      undefined,
      xmlDoc,
      this.tagModels,
      this.tagModel,
      (_, node: Element) => {
        const dao: ModelDAO = this.readModelDao(daos, node)

        // Simulations
        this.readGroup<ModelDAO>(
          dao,
          node,
          this.tagSimulations,
          this.tagSimulation,
          (dao: ModelDAO, node: Element) => {
            // References.
            const references: References = this.readReferences(dao, node)
            references.addFilterReference('time') // time must be present in variables

            const variables: Array<string> = Array.from(references.filterToElementReferences.keys())

            const simulation: Simulation = new Simulation(dao, variables, references)
            const attribute: string | null = node.getAttribute(this.attrDateTime)
            if (attribute) {
              simulation.dateTime = DateTime.fromFormat(attribute, this.formatDateTime).toJSDate()
            }
            simulations.push(simulation)

            // Results
            this.readResults(simulation, node)
          }
        )
      }
    )

    return simulations
  }

  private readElement(dao: ModelDAO, elem: Element): IElement {
    const id: string = this.readId(elem)

    const attribute: string | null = elem.getAttribute(this.attrType)
    if (!attribute) {
      throw new ResultsXMLConverterError(
        i18n.global.t('ImportFailedNoElementType', { element: elem.tagName })
      )
    }
    const type: ElementType = ElementType.fromString(attribute)
    const subtype: string = elem.getAttribute(this.attrSubtype) ?? ''

    let element: IElement | undefined = dao.model.getElement(id)
    if (!element) {
      switch (type) {
        case ElementType.ARC: {
          element = new DataArc(
            id,
            new DataPlace('', PlaceType.CONTINUOUS),
            new DataTransition('', TransitionType.CONTINUOUS),
            ArcType.NORMAL
          )
          break
        }
        case ElementType.PLACE: {
          element = new DataPlace(id, PlaceType.fromString(subtype))
          dao.model.addElement(element)
          break
        }
        case ElementType.TRANSITION: {
          element = new DataTransition(id, TransitionType.fromString(subtype))
          dao.model.addElement(element)
          break
        }
      }
    }

    return element
  }

  private readId(node: Element): string {
    let attribute: string | null = node.getAttribute(this.attrId)
    if (attribute) {
      return attribute
    } else {
      throw new ResultsXMLConverterError(
        i18n.global.t('ImportFailedNoElementId', { element: node.tagName })
      )
    }
  }

  private readModelDao(daos: Array<ModelDAO>, elem: Element): ModelDAO {
    let dao: ModelDAO | undefined = undefined

    const id: string = this.readId(elem)
    const author: string = elem.getAttribute(this.attrAuthor) ?? ''
    const name: string = elem.getAttribute(this.attrName) ?? ''

    for (const d of this.services.modelService.models) {
      if (d.id.localeCompare(id) == 0) {
        dao = d
        break
      }
    }

    if (!dao) {
      for (const d of daos) {
        if (d.id.localeCompare(id) == 0) {
          dao = d
          break
        }
      }
    }

    if (!dao) {
      dao = new ModelDAO(id)
      dao.author = author
      dao.name = name
    }

    return dao
  }

  private readReferences(dao: ModelDAO, node: Element): References {
    const references: References = new References()
    this.readGroup<ModelDAO>(
      dao,
      node,
      this.tagReferences,
      this.tagElement,
      (dao: ModelDAO, node: Element) => {
        const element: IElement = this.readElement(dao, node)
        this.readGroup<References>(
          references,
          node,
          '',
          this.tagVariable,
          (references: References, node: Element) => {
            const id: string = this.readId(node)
            references.addElementReference(element, id)
            if (element.elementType != ElementType.ARC) {
              // filter variable is meant to reference node only
              references.addFilterReference(id, element)
            }
          }
        )
      }
    )

    return references
  }

  private readResults(simulation: Simulation, node: Element) {
    this.readGroup<Simulation>(
      simulation,
      node,
      this.tagResults,
      this.tagData,
      (simulation: Simulation, node: Element) => {
        const id: string = this.readId(node)
        const content: string | null = node.textContent
        if (content) {
          const values: Array<number | bigint> = simulation.getData(id)
          for (const value of content.split(',')) {
            values.push(parseFloat(value))
          }
        }
      }
    )
  }

  private writeDataValues(
    dom: Document,
    variableId: string,
    data: Array<number | bigint>
  ): Element {
    const elem: Element = dom.createElement(this.tagData)
    elem.setAttribute(this.attrId, variableId)

    let dataString: string = ''
    for (const item of data) {
      dataString += item.toString() + ','
    }
    if (dataString.length > 1) {
      dataString = dataString.substring(0, dataString.length - 1)
    }

    elem.textContent = dataString

    return elem
  }

  private writeElement(elem: Element, element: IElement): Element {
    elem.setAttribute(this.attrId, element.id)
    elem.setAttribute(this.attrType, ElementType.toString(element.elementType))

    switch (element.elementType) {
      case ElementType.PLACE: {
        elem.setAttribute(this.attrSubtype, PlaceType.toString((element as Place).placeType))
        break
      }
      case ElementType.TRANSITION: {
        elem.setAttribute(
          this.attrSubtype,
          TransitionType.toString((element as Transition).transitionType)
        )
        break
      }
    }

    return elem
  }

  private writeSimulation(simulationResult: Simulation, dom: Document, models: Element): Element {
    const modelAuthor: string = simulationResult.dao.author
    const modelId: string = simulationResult.dao.id
    const modelName: string = simulationResult.dao.name
    const simulationDateTime: string = DateTime.fromJSDate(simulationResult.dateTime).toFormat(
      this.formatDateTime
    )

    let model: Element | undefined = undefined
    let simulations: Element | undefined = undefined
    // Check if model exists.
    this.readGroup<Simulation>(
      simulationResult,
      models,
      '',
      '*',
      (_: Simulation, node: Element) => {
        if (
          node.getAttribute(this.attrName) == modelName &&
          node.getAttribute(this.attrAuthor) == modelAuthor
        ) {
          model = node
          simulations = models.getElementsByTagName(this.tagSimulations)[0]
        }
      }
    )

    if (!model) {
      model = dom.createElement(this.tagModel)
      model.setAttribute(this.attrAuthor, modelAuthor)
      model.setAttribute(this.attrId, modelId)
      model.setAttribute(this.attrName, modelName)
      models.appendChild(model)
    }

    if (!simulations) {
      simulations = dom.createElement(this.tagSimulations)
      model.appendChild(simulations)
    }

    let simulation: Element | undefined = undefined
    let elements: Element | undefined = undefined
    let results: Element | undefined = undefined
    // Check if simulation exists.
    this.readGroup<undefined>(
      undefined,
      simulations,
      '',
      this.tagSimulation,
      (_, node: Element) => {
        if (node.getAttribute(this.attrDateTime) == simulationDateTime) {
          simulation = node
          elements = node.getElementsByTagName(this.tagReferences)[0]
          results = node.getElementsByTagName(this.tagResults)[0]
        }
      }
    )

    if (!simulation) {
      simulation = dom.createElement(this.tagSimulation)
      simulation.setAttribute(this.attrDateTime, simulationDateTime)
      simulations.appendChild(simulation)
    }

    if (elements == null) {
      elements = dom.createElement(this.tagReferences)
      simulation.appendChild(elements)
    }

    if (!results) {
      results = dom.createElement(this.tagResults)
      results.appendChild(this.writeDataValues(dom, 'time', simulationResult.timeData ?? [])) // append time data
      simulation.appendChild(results)
    }

    return simulation
  }

  private writeVariable(dom: Document, variableId: string, show: boolean): Element {
    const elem: Element = dom.createElement(this.tagVariable)
    elem.setAttribute(this.attrId, variableId)
    elem.setAttribute(this.attrShow, show.toString())
    return elem
  }
}
