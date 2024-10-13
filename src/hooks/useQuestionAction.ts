import { useState } from "react";


export const useQuestionActions = () => {
    const [options, setOptions] = useState<string[]>([]);
  
   
    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  
    return { options, addOption, removeOption,  setOptions };
  };