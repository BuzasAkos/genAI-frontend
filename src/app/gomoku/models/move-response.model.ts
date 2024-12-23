import { GomokuCell } from "./gomoku-game.model";

export interface MoveResponseDto {

    machine?: GomokuCell;

    winner?: number;

    sequence?: GomokuCell[]

}