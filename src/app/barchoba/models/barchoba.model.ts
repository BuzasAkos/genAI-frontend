export interface Barchoba {
    id: string;
  
    started: Date;
  
    finished: Date;
    
    solution?: string;
  
    player?: string;
  
    competition?: string;
  
    questionCount?: number;
  
    active: boolean;
  
    successful?: boolean;
  
    messages?: Array<{ role: string; content: string }>;
  }