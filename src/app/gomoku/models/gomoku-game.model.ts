export interface GomokuGame {

  _id: string;

  startedAt: Date;

  finishedAt?: Date;

  modifiedAt?: Date;

  isActive: boolean;

  humanMark: string;

  machineMark: string;

  winner?: string;

  board: string[][]

  moves?: Array<GomokuMove>

  sequence?: Array<GomokuCell>

}

export interface GomokuMove {
  
  id: string;

  mark: string;

  row: string;

  col: string;

  createdAt: Date;

}

export interface GomokuCell {

    row: number;
  
    col: number;

}
