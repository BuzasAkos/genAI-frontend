export interface LeaderboardItem {
    competition: string,
    player: string,
    questionCount: number,
    started: Date,
    finished: Date,
    duration: number,
    solution: string,
    successful: boolean,
    position?: number
}