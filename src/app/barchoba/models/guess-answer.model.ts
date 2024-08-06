export interface GuessAnswer {
    guess: string, 
    solution: string, 
    successful?: boolean, 
    countQ: number, 
    competition?: string
}