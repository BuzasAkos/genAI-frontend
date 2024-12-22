export interface GomokuGame {

  _id: string;

  startedAt: Date;

  finishedAt?: Date;

  modifiedAt?: Date;

  isActive: boolean;

  humanMark: string;

  machineMark: string;

  board: string[][]

  moves?: Array<GomokuMove>

}

export interface GomokuMove {
  
  id: string;

  mark: string;

  row: string;

  col: string;

  createdAt: Date;

}
