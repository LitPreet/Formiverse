export interface Question {
    _id: string;
    form: string;
    questionText: string;
    questionDescription: string;
    questionType: 'email'| 'paragraph' | 'mcq' | 'checkbox' | 'dropdown' | 'date' | 'time' | 'url';
    options?: string[]; 
    required: boolean;
    createdAt?: string; 
    updatedAt?: string;
  }
  export interface IForm {
    _id: string;                
    heading: string;            
    description: string;        
    createdAt: string;          
    questionsCount: number;     
}

export interface Form {
  heading: string;
  description: string;
  questions: Question[];
}