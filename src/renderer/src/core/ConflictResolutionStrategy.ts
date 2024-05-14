export enum ConflictResolutionStrategy {
  PRIORITY,
  PROBABILITY
}

export namespace ConflictResolutionStrategy {
  export function fromString(value: string | null): ConflictResolutionStrategy {
    switch (value) {
      case 'PRIORITY':
        return ConflictResolutionStrategy.PRIORITY
      case 'PROBABILITY':
        return ConflictResolutionStrategy.PROBABILITY
      default:
        return ConflictResolutionStrategy.PRIORITY
    }
  }

  export function toString(placeType: ConflictResolutionStrategy): string {
    switch (placeType) {
      case ConflictResolutionStrategy.PRIORITY:
        return 'PRIORITY'
      case ConflictResolutionStrategy.PROBABILITY:
        return 'PROBABILITY'
    }
  }
}
