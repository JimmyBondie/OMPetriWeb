import { CustomError } from '@renderer/utils/CustomError'

export enum DataType {
  ARC,
  CLUSTER,
  CLUSTERARC,
  PLACE,
  TRANSITION
}

export class DataError extends CustomError {}
