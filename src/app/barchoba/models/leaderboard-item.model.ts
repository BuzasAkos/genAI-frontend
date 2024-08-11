export interface LeaderboardItem {
    competition: string,
    player: string,
    questionCount: number,
    started: Date,
    finished: Date,
    solution: string,
    successful: boolean,
    position?: number
}