export interface GomokuGame {

  _id: string;

  startedAt: Date;

  finishedAt?: Date;

  modifiedAt?: Date;

  isActive: boolean;

  humanMark: string;

  machineMark: string;

  winner?: number;

  board: number[][]

  moves?: Array<GomokuMove>

  sequence?: Array<GomokuCell>

}

export interface GomokuMove {
  
  id: string;

  mark: number;

  row: number;

  col: number;

  createdAt: Date;

}

export interface GomokuCell {

    row: number;
  
    col: number;

}
