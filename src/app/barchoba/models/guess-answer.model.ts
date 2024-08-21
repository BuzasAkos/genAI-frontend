export interface GuessAnswer {
    guess: string, 
    solution: string, 
    successful?: boolean, 
    countQ: number,
    duration: number, 
    competition?: string
}