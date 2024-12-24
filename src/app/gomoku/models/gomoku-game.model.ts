export interface GomokuGame {

  _id: string;

  startedAt: Date;

  finishedAt?: Date;

  modifiedAt?: Date;

  isActive: boolean;

  humanMark: string;

  machineMark: string;

  counter: number;

  winner?: number;

  board: number[][]

  moves?: Array<GomokuMove>

  sequence?: Array<GomokuCell>

  finishReason?: string;

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
