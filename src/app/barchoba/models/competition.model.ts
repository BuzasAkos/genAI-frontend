

export interface Competition {
  
    id: string;
  
    createdAt: Date;
  
    startedAt?: Date;
    
    ongoing: boolean;
  
    closedAt?: Date;
  
    competitionName: string;
  
    showBoard: boolean;
}