export interface Question {
    _id: string;
    form: string;
    questionText: string;
    questionType: 'email'| 'paragraph' | 'mcq' | 'checkbox' | 'dropdown' | 'date' | 'time' | 'url';
    options: string[]; 
    required: boolean;
    createdAt: string; 
    updatedAt: string;
    __v: number;
  }
  export interface IForm {
    _id: string;                // Unique identifier for the form
    heading: string;            // The title of the form
    description: string;        // Description of the form
    createdAt: string;          // Timestamp of when the form was created
    questionsCount: number;     // Count of questions in the form
}