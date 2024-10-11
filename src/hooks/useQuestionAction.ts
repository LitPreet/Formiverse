import { useMutation } from "react-query";
import { toast } from "./use-toast";
import { useState } from "react";
import { deleteFormQuestion } from "@/api/auth";

export const useQuestionActions = (refetch: any) => {
    const [options, setOptions] = useState<string[]>([]);
  
   
    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  
    return { options, addOption, removeOption,  setOptions };
  };