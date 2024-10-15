import { Color } from '@renderer/core/Color'
import { Model } from '@renderer/core/Model'
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { References } from '@renderer/core/References'
import { Arc } from '@renderer/entity/impl/Arc'
import { Place, PlaceType } from '@renderer/entity/impl/Place'
import { DistributionType, Transition, TransitionType } from '@renderer/entity/impl/Transition'
import { CustomError } from './CustomError'
import { ArcType, IArc } from '@renderer/entity/intf/IArc'
import { Token } from '@renderer/core/Token'
import { Function, FunctionType } from '@renderer/core/Function'
import { ConflictResolutionStrategy } from '@renderer/core/ConflictResolutionStrategy'
import { Weight } from '@renderer/core/Weight'
import { INode } from '@renderer/entity/intf/INode'
import { IElement } from '@renderer/entity/intf/IElement'
import { services } from '@renderer/services'
import i18n from '@renderer/main'

export class OpenModelicaExporterException extends CustomError {}

export class OpenModelicaExporter extends Object {
  private readonly INDENT: string = '  '
  private readonly CMNT_START: string = '/*'
  private readonly CMNT_END: string = '*/'

  public export(
    name: string,
    model: Model,
    fileMOS: string,
    fileMO: string,
    workDirectory: string
  ): References {
    fileMO = this.exportMO(name, model, fileMO)
    return this.exportMOS(name, model, fileMOS, fileMO, workDirectory)
  }

  public exportMO(name: string, model: Model, file: string): string {
    const content: Array<string> = new Array<string>()

    const arcs: Array<Arc> = model.arcs
    const colors: Array<Color> = model.colors
    let places: Array<Place> = model.places
    let transitions: Array<Transition> = model.transitions
    const parameters: Map<string, Parameter> = new Map<string, Parameter>()

    const isColoredPn: boolean = colors.length != 1

    // Model name.
    content.push(`model '${name}'`)

    // Functions.
    if (isColoredPn) {
      content.push(
        'function g1',
        '    input Real[2] inColors;',
        '    output Real[2] outWeights;',
        '  algorithm',
        '    if sum(inColors) < 1e-12 then',
        '      outWeights := fill(1, 2);',
        '    else',
        '      outWeights[1] := inColors[1] / sum(inColors);',
        '      outWeights[2] := inColors[2] / sum(inColors);',
        '    end if;',
        '  end g1;',
        '  function g2',
        '    input Real[2] inColors1;',
        '    input Real[2] inColors2;',
        '    output Real[2] outWeights;',
        '  algorithm',
        '    if sum(inColors1) < 1e-12 then',
        '      outWeights := fill(0.5, 2);',
        '    else',
        '      outWeights[1] := inColors1[1] / sum(inColors1) / 2;',
        '      outWeights[2] := inColors1[2] / sum(inColors1) / 2;',
        '    end if;',
        '',
        '    if sum(inColors2) < 1e-12 then',
        '      outWeights[1] := outWeights[1] + 0.5;',
        '      outWeights[2] := outWeights[2] + 0.5;',
        '    else',
        '      outWeights[1] := outWeights[1] + inColors2[1] / sum(inColors2) / 2;',
        '      outWeights[2] := outWeights[2] + inColors2[2] / sum(inColors2) / 2;',
        '    end if;',
        '  end g2;',
        ''
      )
    }

    // Settings
    content.push(`${this.INDENT}inner PNlib.Components.Settings settings(showTokenFlow = true);`)

    // Parameters.
    for (const param of model.parameters) {
      parameters.set(`_${param.id}`, param)
    }

    for (const transition of transitions) {
      for (const param of transition.localParameters) {
        parameters.set(`_${transition.id}_${param.id}`, param)
      }
    }

    Array.from(parameters.entries())
      .sort((e1: [string, Parameter], e2: [string, Parameter]) =>
        e1[0].toLowerCase().localeCompare(e2[0].toLowerCase())
      )
      .filter((entry: [string, Parameter]) => entry[1].type != ParameterType.REFERENCE)
      .forEach((entry: [string, Parameter]) => {
        let text: string = `${this.INDENT}parameter Real '${entry[0]}'`

        if (entry[1].unit != '') {
          text += `(final unit=\"${entry[1].unit}\")`
        }
        text += ` = ${entry[1].value};`

        content.push(text)
      })

    // Places.
    places = places.sort((p1: Place, p2: Place) =>
      p1.id.toLowerCase().localeCompare(p2.id.toLowerCase())
    )
    for (const place of places) {
      let line: string = this.INDENT
      let tokenType: string = ''

      if (place.disabled) {
        line += this.CMNT_START
      }

      switch (place.placeType) {
        case PlaceType.CONTINUOUS: {
          if (isColoredPn) {
            line += 'PNlib.Examples.Models.BicoloredPlaces.CPC'
          } else {
            line += 'PNlib.Components.PC'
          }
          tokenType = 'Marks'
          break
        }

        case PlaceType.DISCRETE: {
          if (isColoredPn) {
            line += ''
            throw new OpenModelicaExporterException(
              i18n.global.t('ColoredDiscretePlacesAreNotSupported')
            ) // TODO
          } else {
            line += 'PNlib.Components.PD'
          }
          tokenType = 'Tokens'
          break
        }

        default: {
          throw new OpenModelicaExporterException(
            i18n.global.t('UnhandledPlaceType', { type: PlaceType.toText(place.placeType) })
          )
        }
      }
      line += ` '${place.id}'`
      line += `(nIn=${place.arcsIn.filter((arc: IArc) => !arc.disabled).length}`
      line += `,nOut=${place.arcsOut.filter((arc: IArc) => !arc.disabled).length}`

      let isFirst: boolean = true

      // Token
      let tmp1: string = ''
      let tmp2: string = ''
      let tmp3: string = ''
      let unit: string = ''

      for (const color of colors) {
        const token: Token | undefined = place.getToken(color)

        if (isColoredPn) {
          if (isFirst) {
            isFirst = false
          } else {
            tmp1 += ','
            tmp2 += ','
            tmp3 += ','
          }

          if (token) {
            tmp1 += this.formatNumber(token.valueStart, place.placeType == PlaceType.CONTINUOUS)
            tmp2 += this.formatNumber(token.valueMin, place.placeType == PlaceType.CONTINUOUS)
            tmp3 += this.formatNumber(token.valueMax, place.placeType == PlaceType.CONTINUOUS)
          } else {
            tmp1 += '0'
            tmp2 += '0'
            tmp3 += '0'
          }
        } else {
          if (!token) {
            throw new OpenModelicaExporterException(
              i18n.global.t('NoTokenForColorAvailable', { id: color.id })
            )
          }

          tmp1 += this.formatNumber(token.valueStart, place.placeType == PlaceType.CONTINUOUS)
          tmp2 += this.formatNumber(token.valueMin, place.placeType == PlaceType.CONTINUOUS)
          tmp3 += this.formatNumber(token.valueMax, place.placeType == PlaceType.CONTINUOUS)
          unit = token.unit
        }
      }

      if (isColoredPn) {
        tmp1 = `{${tmp1}}`
        tmp2 = `{${tmp2}}`
        tmp3 = `{${tmp3}}`
      }

      line += `,start${tokenType}=${tmp1}`
      line += `,min${tokenType}=${tmp2}`
      line += `,max${tokenType}=${tmp3}`

      if (!isColoredPn && unit != '') {
        line += `,t(final unit=\"${unit}\")`
      }

      line += this.writePlaceConflictResolution(place)

      line += ')'
      line += ';'

      if (place.disabled) {
        line += this.CMNT_END
      }

      content.push(line)
    }

    // Transitions.
    transitions = transitions.sort((t1: Transition, t2: Transition) =>
      t1.id.toLowerCase().localeCompare(t2.id.toLowerCase())
    )
    for (const transition of transitions) {
      let functionType: string = ''
      let line: string = this.INDENT
      switch (transition.transitionType) {
        case TransitionType.CONTINUOUS: {
          if (isColoredPn) {
            line += 'PNlib.Examples.Models.BicoloredPlaces.CTC'
            functionType = 'maximumSpeed'
          } else {
            line += 'PNlib.Components.TC'
            functionType = 'maximumSpeed'
          }
          break
        }

        case TransitionType.DISCRETE: {
          if (isColoredPn) {
            line += ''
            throw new OpenModelicaExporterException(
              i18n.global.t('ColoredDiscreteTransitionsAreNotSupported')
            )
          } else {
            line += 'PNlib.Components.TD'
            functionType = 'delay'
          }
          break
        }

        case TransitionType.STOCHASTIC: {
          if (isColoredPn) {
            line += ''
            throw new OpenModelicaExporterException(
              i18n.global.t('ColoredStochasticTransitionsAreNotSupported')
            )
          } else {
            line += 'PNlib.Components.TDS'
            functionType = 'h' // TODO
          }
          break
        }

        default: {
          throw new OpenModelicaExporterException(
            i18n.global.t('UnhandledTransitionType', {
              type: TransitionType.toText(transition.transitionType)
            })
          )
        }
      }
      line += ` '${transition.id}'`
      line += `(nIn=${transition.arcsIn.filter((arc: IArc) => !arc.disabled).length}`
      line += `,nOut=${transition.arcsOut.filter((arc: IArc) => !arc.disabled).length}`
      line += `,${functionType}`

      // Function and parameters
      const functionValue: Function = transition.function
      if (functionValue.unit != '') {
        line += `(final unit=\"${functionValue.unit}\")`
      }
      if (transition.disabled) {
        line += `=0${this.CMNT_START}${this.getFunctionValueString(model, transition, functionValue)}${this.CMNT_END}`
      } else {
        line += `=${this.getFunctionValueString(model, transition, functionValue)}`
      }

      // Distribution
      if (transition.transitionType == TransitionType.STOCHASTIC) {
        line += `,distributionType=PNlib.Types.DistributionType.${DistributionType.toString(transition.distribution)}`
        if (transition.distribution == DistributionType.UNIFORM) {
          line += `,a=${this.formatNumber(transition.lowerLimit, true)}`
          line += `,b=${this.formatNumber(transition.upperLimit, true)}`
        } else if (transition.distribution == DistributionType.NORMAL) {
          line += `,mu=${this.formatNumber(transition.expectedValue, true)}`
          line += `,sigma=${this.formatNumber(transition.standardDeviation, true)}`
        }
      }

      // Weights.
      let tmp1: string = this.writeWeights(model, transition.arcsIn, colors)
      if (tmp1 != '') {
        line += `,arcWeightIn={${tmp1}}`
      }
      tmp1 = this.writeWeights(model, transition.arcsOut, colors)
      if (tmp1 != '') {
        line += `,arcWeightOut={${tmp1}}`
      }

      line += ')'
      line += ';'
      content.push(line)
    }

    // Arcs.
    for (const arc of arcs) {
      if (arc.arcType == ArcType.NORMAL) {
        continue
      }

      const isDisabled: boolean = arc.disabled || arc.source.disabled || arc.target.disabled

      let line: string = this.INDENT
      if (isDisabled) {
        line += this.CMNT_START
      }

      switch (arc.arcType) {
        case ArcType.INHIBITORY: {
          line += 'PNlib.Components.IA'
          break
        }

        case ArcType.TEST: {
          line += 'PNlib.Components.TA'
          break
        }

        default: {
          throw new OpenModelicaExporterException(
            i18n.global.t('CannotExportUnhandledArcType', { type: ArcType.toText(arc.arcType) })
          )
        }
      }

      line += ` '${arc.id}'(`
      line += 'testValue='

      let tmp: string = ''
      let isFirstColour: boolean = true
      for (const color of colors) {
        if (isFirstColour) {
          isFirstColour = false
        } else {
          tmp += ','
        }
        if (isColoredPn) {
          tmp += this.getWeightString(model, arc, color)
        } else {
          line += this.getWeightString(model, arc, color)
        }
      }
      if (isColoredPn) {
        line += `{${tmp}}/*${arc.source.id}*/`
      }

      line += ');'
      if (isDisabled) {
        line += this.CMNT_END
      }
      content.push(line)
    }

    content.push('equation')

    // Connections.
    for (const arc of arcs) {
      let line: string = ''
      switch (arc.arcType) {
        case ArcType.NORMAL: {
          line += this.writeConnectionNormal(arc)
          break
        }

        case ArcType.INHIBITORY: {
          try {
            line += this.writeConnectionNonNormal(arc)
          } catch (e: any) {
            throw new OpenModelicaExporterException(
              e.message + ' ' + i18n.global.t('TransitionCannotInhibitPlace')
            )
          }
          break
        }

        case ArcType.TEST: {
          try {
            line += this.writeConnectionNonNormal(arc)
          } catch (e: any) {
            throw new OpenModelicaExporterException(
              e.message + ' ' + i18n.global.t('TransitionCannotTestPlace')
            )
          }
          break
        }

        default: {
          throw new OpenModelicaExporterException(
            i18n.global.t('UnexpectedArcType', { type: ArcType.toText(arc.arcType) })
          )
        }
      }

      content.push(line)
    }

    content.push(`end \'${name}\';`)

    window.api.writeFile(file, content.join('\n'), { encoding: 'utf-8' })

    return file
  }

  public exportMOS(
    name: string,
    model: Model,
    fileMOS: string,
    fileMO: string,
    workDirectory: string
  ): References {
    const references: References = this.getModelReferences(model)
    const filters: Array<string> = Array.from(references.filterToElementReferences.keys())

    let allFilter: string = 'variableFilter="'
    for (const filter of filters) {
      allFilter += filter + '|'
    }

    allFilter = allFilter.substring(0, allFilter.length - 1)
    allFilter = allFilter.replaceAll('.', '\\\\.') // might cause problems when custom names are used
    allFilter = allFilter.replaceAll('[', '\\\\[')
    allFilter = allFilter.replaceAll(']', '\\\\]')
    allFilter = allFilter.replaceAll('(', '\\\\(')
    allFilter = allFilter.replaceAll(')', '\\\\)')
    allFilter += '"'

    let content: Array<string> = new Array<string>()

    content.push(`cd(\"${workDirectory.replaceAll('\\', '/')}/\"); getErrorString();`)
    content.push('loadModel(PNlib); getErrorString();')
    content.push(`loadFile(\"${fileMO.replaceAll('\\', '/')}\"); getErrorString();`)
    content.push('setCommandLineOptions("--preOptModules+=unitChecking"); getErrorString();')
    content.push(`buildModel('${name}', ${allFilter}); getErrorString();`)

    window.api.writeFile(fileMOS, content.join('\n'), { encoding: 'utf-8' })

    return references
  }

  private formatNumber(num: number, float: boolean): string {
    const maxFloat: number = 3.40282e38
    const maxInt: number = 1073741823

    let value: number
    if (float) {
      if (num < -maxFloat) {
        value = -maxFloat
      } else if (num > maxFloat) {
        value = maxFloat
      } else {
        value = num
      }

      return value.toString()
    } else {
      if (num < -maxInt) {
        value = -maxInt
      } else if (num > maxInt) {
        value = maxInt
      } else {
        value = num
      }

      return value.toFixed(0)
    }
  }

  private getArcIndexWithSourceNode(arcs: Array<IArc>, source: INode): number {
    let index: number = 1
    for (const a of arcs) {
      if (source.equals(a.source)) {
        return index
      }
      if (!a.disabled) {
        index++ // no increment if disabled - handle as if arc does not exist
      }
    }
    throw new OpenModelicaExporterException(i18n.global.t('ArcSourceCannotBeFound'))
  }

  private getArcIndexWithTargetNode(arcs: Array<IArc>, target: INode): number {
    let index: number = 1
    for (const a of arcs) {
      if (target.equals(a.target)) {
        return index
      }
      if (!a.disabled) {
        index++
      }
    }
    throw new OpenModelicaExporterException(i18n.global.t('ArcTargetCannotBeFound'))
  }

  // Gets the string representing an element's function.
  private getFunctionValueString(
    model: Model,
    dataElement: IElement,
    functionValue: Function | undefined
  ): string {
    let functionString: string = ''
    if (functionValue) {
      for (const functionElement of functionValue.elements) {
        switch (functionElement.type) {
          case FunctionType.FUNCTION: {
            functionString += this.getFunctionValueString(model, dataElement, functionElement)
            break
          }

          case FunctionType.PARAMETER: {
            const param: Parameter | undefined = services.parameterService.findParameter(
              model,
              functionElement.value,
              dataElement
            )
            if (param) {
              functionString += param.value
            }
            break
          }

          default: {
            functionString += functionElement.value
            break
          }
        }
      }
    }
    return functionString
  }

  // Creates and gets element filter references for an entire model.
  public getModelReferences(model: Model): References {
    const references: References = new References()
    for (const place of model.places) {
      if (!place.disabled) {
        this.setPlaceReferences(references, place)
      }
    }
    for (const transition of model.transitions) {
      this.setTransitionReferences(references, transition)
    }
    return references
  }

  private getWeightString(model: Model, arc: IArc, color: Color): string {
    const weight: Weight | undefined = arc.getWeight(color)
    let functionValue: Function | undefined
    if (weight) {
      functionValue = weight.function
    } else {
      functionValue = undefined
    }

    if (
      arc.disabled ||
      !functionValue ||
      arc.source.constant ||
      arc.source.disabled ||
      arc.target.constant ||
      arc.target.disabled
    ) {
      return (
        '0' +
        this.CMNT_START +
        this.getFunctionValueString(model, arc, functionValue) +
        this.CMNT_END
      )
    } else {
      return this.getFunctionValueString(model, arc, functionValue)
    }
  }

  // Sets element filter references for a place.
  private setPlaceReferences(references: References, place: Place): References {
    let filter: string = `'${place.id}'.t`
    references.addElementReference(place, filter)
    references.addFilterReference(filter, place)

    let index: number = 1
    for (const arc of place.arcsOut) {
      if (arc.disabled) {
        continue
      }

      filter = `'${arc.source.id}'.tokenFlow.outflow[${index}]`
      references.addElementReference(arc, filter)
      references.addElementReference(place, filter)
      references.addFilterReference(filter, place)

      filter = `der(${filter})`
      references.addElementReference(arc, filter)
      references.addElementReference(place, filter)
      references.addFilterReference(filter, place)
      index++
    }

    index = 1
    for (const arc of place.arcsIn) {
      if (arc.disabled) {
        continue
      }

      filter = `'${arc.target.id}'.tokenFlow.inflow[${index}]`
      references.addElementReference(arc, filter)
      references.addElementReference(place, filter)
      references.addFilterReference(filter, place)

      filter = `der(${filter})`
      references.addElementReference(arc, filter)
      references.addElementReference(place, filter)
      references.addFilterReference(filter, place)
      index++
    }

    return references
  }

  // Sets element filter references for a transition.
  private setTransitionReferences(references: References, transition: Transition): References {
    let filter: string = ''

    filter = `'${transition.id}'.actualSpeed`
    references.addElementReference(transition, filter)
    references.addFilterReference(filter, transition)

    filter = `'${transition.id}'.fire`
    references.addElementReference(transition, filter)
    references.addFilterReference(filter, transition)

    return references
  }

  private writeConnectionNonNormal(arc: IArc): string {
    const isDisabled: boolean = arc.disabled || arc.source.disabled || arc.target.disabled
    let connection: string = ''
    if (arc.source instanceof Place) {
      connection = this.INDENT
      if (isDisabled) {
        connection += this.CMNT_START
      }
      connection += 'connect('
      connection += `'${arc.source.id}'.outTransition[${this.getArcIndexWithTargetNode(arc.source.arcsOut, arc.target)}],`
      connection += `'${arc.id}'.inPlace`
      connection += ')'
      connection += ';'
      if (isDisabled) {
        connection += this.CMNT_END + '\n' + this.INDENT + this.CMNT_START
      } else {
        connection += '\n' + this.INDENT
      }
      connection += 'connect('
      connection += `'${arc.id}'.outTransition,`
      connection += `'${arc.target.id}'.inPlaces[${this.getArcIndexWithSourceNode(arc.target.arcsIn, arc.source)}]`
      connection += ')'
      connection += ';'
      if (isDisabled) {
        connection += this.CMNT_END
      }
    } else {
      throw new OpenModelicaExporterException(i18n.global.t('InvalidConnection'))
    }

    return connection
  }

  private writeConnectionNormal(arc: IArc): string {
    const isDisabled: boolean = arc.disabled || arc.source.disabled || arc.target.disabled
    let connection: string = this.INDENT

    if (isDisabled) {
      connection += this.CMNT_START
    }
    connection += 'connect('
    if (arc.source instanceof Place) {
      connection += `'${arc.source.id}'.outTransition[${this.getArcIndexWithTargetNode(arc.source.arcsOut, arc.target)}],`
      connection += `'${arc.target.id}'.inPlaces[${this.getArcIndexWithSourceNode(arc.target.arcsIn, arc.source)}]`
    } else {
      connection += `'${arc.source.id}'.outPlaces[${this.getArcIndexWithTargetNode(arc.source.arcsOut, arc.target)}],`
      connection += `'${arc.target.id}'.inTransition[${this.getArcIndexWithSourceNode(arc.target.arcsIn, arc.source)}]`
    }
    connection += ')'
    connection += ';'
    if (isDisabled) {
      connection += this.CMNT_END
    }

    return connection
  }

  private writePlaceConflictResolution(place: Place): string {
    let confRes: string = ''
    let confResIn: string = ''
    let confResOut: string = ''

    switch (place.conflictResolutionType) {
      case ConflictResolutionStrategy.PRIORITY: {
        confRes = ', enablingType=PNlib.Types.EnablingType.Priority'

        if (place.arcsIn.length > 1) {
          confResIn = ', enablingPrioIn={'
          let index: number = 1
          for (const arcIn of place.arcsIn) {
            if (!arcIn.disabled) {
              confResIn += `${index},`
              index += 1
            }
          }
          confResIn = confResIn.substring(0, confResIn.length - 1)
          confResIn += '}'

          if (index == 1) {
            confResIn = ''
          }
        }

        if (place.arcsOut.length > 1) {
          confResOut = ', enablingPrioOut={'
          let index: number = 1
          for (const arcOut of place.arcsOut) {
            if (!arcOut.disabled) {
              confResOut += `${index},`
              index += 1
            }
          }
          confResOut = confResOut.substring(0, confResOut.length - 1)
          confResOut += '}'

          if (index == 1) {
            confResOut = ''
          }
        }

        break
      }

      case ConflictResolutionStrategy.PROBABILITY: {
        confRes = ', enablingType=PNlib.Types.EnablingType.Probability'

        if (place.arcsIn.length > 1) {
          confResIn = ', enablingProbIn={'
          let index: number = 1
          for (const arcIn of place.arcsIn) {
            if (!arcIn.disabled) {
              confResIn += `${arcIn.conflictResolutionValue}/${place.arcsIn.length},`
              index++
            }
          }
          confResIn = confResIn.substring(0, confResIn.length - 1)
          confResIn += '}'

          if (index == 1) {
            confResIn = ''
          }
        }

        if (place.arcsOut.length > 1) {
          confResOut = ', enablingProbOut={'
          let index: number = 1
          for (const arcOut of place.arcsOut) {
            if (!arcOut.disabled) {
              confResOut += `${arcOut.conflictResolutionValue}/${place.arcsOut.length},`
              index++
            }
          }
          confResOut = confResOut.substring(0, confResOut.length - 1)
          confResOut += '}'

          if (index == 1) {
            confResOut = ''
          }
        }

        break
      }

      default: {
        throw new OpenModelicaExporterException(i18n.global.t('UnhandledConflictResolutionType'))
      }
    }

    return confRes + confResIn + confResOut
  }

  private writeWeights(model: Model, arcs: Array<IArc>, colors: Array<Color>): string {
    const isColoredPn: boolean = colors.length != 1
    let isFirst: boolean = true
    let weight: string = ''
    for (const arc of arcs) {
      if (arc.disabled) {
        continue
      }
      if (isFirst) {
        isFirst = false
      } else {
        weight += ','
      }

      let tmp: string = ''
      let isFirstColour: boolean = true
      for (const color of colors) {
        if (isFirstColour) {
          isFirstColour = false
        } else {
          tmp += ','
        }
        if (isColoredPn) {
          tmp += this.getWeightString(model, arc, color)
        } else {
          weight += this.getWeightString(model, arc, color)
        }
      }
      if (isColoredPn) {
        weight += `{${tmp}}/*${arc.source.id}*/`
      }
    }
    return weight
  }
}
