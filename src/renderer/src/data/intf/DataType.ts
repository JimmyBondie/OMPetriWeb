import i18n from '@renderer/main'
import { CustomError } from '@renderer/utils/CustomError'

export enum DataType {
  ARC,
  CLUSTER,
  CLUSTERARC,
  PLACE,
  TRANSITION
}

export namespace DataType {
  export function fromString(value: string | null): DataType {
    switch (value) {
      case 'ARC':
        return DataType.ARC
      case 'CLUSTER':
        return DataType.CLUSTER
      case 'CLUSTERARC':
        return DataType.CLUSTERARC
      case 'PLACE':
        return DataType.PLACE
      case 'TRANSITION':
        return DataType.TRANSITION
      default:
        return DataType.ARC
    }
  }

  export function toString(placeType: DataType): string {
    switch (placeType) {
      case DataType.ARC:
        return 'ARC'
      case DataType.CLUSTER:
        return 'CLUSTER'
      case DataType.CLUSTERARC:
        return 'CLUSTERARC'
      case DataType.PLACE:
        return 'PLACE'
      case DataType.TRANSITION:
        return 'TRANSITION'
    }
  }

  export function toText(dataType: DataType): string {
    switch (dataType) {
      case DataType.ARC:
        return i18n.global.t('Arc')
      case DataType.CLUSTER:
        return i18n.global.t('Cluster')
      case DataType.CLUSTERARC:
        return i18n.global.t('ClusterArc')
      case DataType.PLACE:
        return i18n.global.t('Place')
      case DataType.TRANSITION:
        return i18n.global.t('Transition')
    }
  }
}

export class DataError extends CustomError {}
