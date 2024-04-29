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
  export function toString(dataType: DataType): string {
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
