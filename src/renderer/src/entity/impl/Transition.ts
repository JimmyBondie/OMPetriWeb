import { Function, FunctionType } from '@renderer/core/Function'
import { ElementType } from '../intf/IElement'
import { Node } from './Node'
import i18n from '@renderer/main'

export enum TransitionType {
  CONTINUOUS,
  DISCRETE,
  STOCHASTIC
}

export namespace TransitionType {
  export function fromString(value: string | null): TransitionType {
    switch (value) {
      case 'CONTINUOUS':
        return TransitionType.CONTINUOUS
      case 'DISCRETE':
        return TransitionType.DISCRETE
      case 'STOCHASTIC':
        return TransitionType.STOCHASTIC
      default:
        return TransitionType.CONTINUOUS
    }
  }

  export function toString(placeType: TransitionType): string {
    switch (placeType) {
      case TransitionType.CONTINUOUS:
        return 'CONTINUOUS'
      case TransitionType.DISCRETE:
        return 'DISCRETE'
      case TransitionType.STOCHASTIC:
        return 'STOCHASTIC'
    }
  }

  export function toText(transitionType: TransitionType): string {
    switch (transitionType) {
      case TransitionType.CONTINUOUS:
        return i18n.global.t('Continuous')
      case TransitionType.DISCRETE:
        return i18n.global.t('Discrete')
      case TransitionType.STOCHASTIC:
        return i18n.global.t('Stochastic')
    }
  }

  export function values(): Array<{ type: TransitionType; name: string }> {
    return [
      {
        type: TransitionType.CONTINUOUS,
        name: TransitionType.toText(TransitionType.CONTINUOUS)
      },
      {
        type: TransitionType.DISCRETE,
        name: TransitionType.toText(TransitionType.DISCRETE)
      },
      {
        type: TransitionType.STOCHASTIC,
        name: TransitionType.toText(TransitionType.STOCHASTIC)
      }
    ]
  }
}

export enum DistributionType {
  EXPONENTIAL,
  NORMAL,
  UNIFORM
}

export namespace DistributionType {
  export function fromString(value: string | null): DistributionType {
    switch (value) {
      case 'Exponential':
        return DistributionType.EXPONENTIAL
      case 'TruncatedNormal':
        return DistributionType.NORMAL
      case 'Uniform':
        return DistributionType.UNIFORM
      default:
        return DistributionType.EXPONENTIAL
    }
  }

  export function toString(placeType: DistributionType): string {
    switch (placeType) {
      case DistributionType.EXPONENTIAL:
        return 'Exponential'
      case DistributionType.NORMAL:
        return 'TruncatedNormal'
      case DistributionType.UNIFORM:
        return 'Uniform'
    }
  }

  export function toText(transitionType: DistributionType): string {
    switch (transitionType) {
      case DistributionType.EXPONENTIAL:
        return i18n.global.t('ExponentialDistribution')
      case DistributionType.NORMAL:
        return i18n.global.t('NormalDistribution')
      case DistributionType.UNIFORM:
        return i18n.global.t('UniformDistribution')
    }
  }

  export function values(): Array<{ type: DistributionType; name: string }> {
    return [
      {
        type: DistributionType.EXPONENTIAL,
        name: DistributionType.toText(DistributionType.EXPONENTIAL)
      },
      {
        type: DistributionType.NORMAL,
        name: DistributionType.toText(DistributionType.NORMAL)
      },
      {
        type: DistributionType.UNIFORM,
        name: DistributionType.toText(DistributionType.UNIFORM)
      }
    ]
  }
}

export class Transition extends Node {
  private _distribution: DistributionType = DistributionType.EXPONENTIAL
  private _expectedValue: number = 0.5
  private _function: Function
  private _lowerLimit: number = 0
  private _standardDeviation: number = 1 / 6
  private _transitionType: TransitionType
  private _upperLimit: number = 1

  public constructor(id: string, transitionType: TransitionType) {
    super(id, ElementType.TRANSITION)
    this._function = new Function(FunctionType.FUNCTION)
    this._function.addElement(new Function(FunctionType.NUMBER, '1'))
    this._transitionType = transitionType
  }

  public get distribution(): DistributionType {
    return this._distribution
  }

  public get expectedValue(): number {
    return this._expectedValue
  }

  public get function(): Function {
    return this._function
  }

  public get lowerLimit(): number {
    return this._lowerLimit
  }

  public get standardDeviation(): number {
    return this._standardDeviation
  }

  public get transitionType(): TransitionType {
    return this._transitionType
  }

  public get upperLimit(): number {
    return this._upperLimit
  }

  public set distribution(distribution: DistributionType) {
    this._distribution = distribution
  }

  public set expectedValue(expectedValue: number) {
    this._expectedValue = expectedValue
  }

  public set function(value: Function) {
    this._function = value
  }

  public set lowerLimit(lowerLimit: number) {
    this._lowerLimit = lowerLimit
  }

  public set standardDeviation(standardDeviation: number) {
    this._standardDeviation = standardDeviation
  }

  public set transitionType(transitionType: TransitionType) {
    this._transitionType = transitionType
  }

  public set upperLimit(upperLimit: number) {
    this._upperLimit = upperLimit
  }
}
