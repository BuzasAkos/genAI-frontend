import { GomokuCell } from "./gomoku-game.model";

export interface MoveResponseDto {

    machine?: GomokuCell;

    winner?: string;

    sequence?: GomokuCell[]

}