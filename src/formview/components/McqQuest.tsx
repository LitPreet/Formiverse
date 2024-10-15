import { Loading } from "@/components/loader/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/lib/types/Form";
import { ChevronDown, ListCheck, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutationResult,
} from "react-query";
import { Form as FormType } from "@/lib/types/Form";
import { deleteFormQuestion } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";



interface MCQQuestion {
  questionData: Question;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
  formEditData: FormType;
  setFormEditData: React.Dispatch<React.SetStateAction<FormType>>;
  form: UseFormReturn<
    {
      heading: string;
      description: string;
      questions?:
        | {
            questionText: string;
            questionDescription: string;
            required: boolean;
            options?: string[] | undefined;
            questionType?: string | undefined;
          }[]
        | undefined;
    },
    any,
    undefined
  >;
  index: number;
  mutation: UseMutationResult<any, any, string, unknown>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const McqQuest = ({
  questionData,
  form,
  index,
  setQuestions,
}: MCQQuestion) => {
  const {
    setValue,
    formState: { errors },
  } = form;

  const [options, setOptions] = useState<string[]>(
    questionData?.options && questionData?.options.length > 0
      ? questionData.options
      : [""]
  );
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setOptions(questionData?.options || [""]); // Ensure options is updated
  }, [questionData]);

  useEffect(() => {
    setValue(`questions.${index}.options`, options);
    setValue(`questions.${index}.questionType`, questionData?.questionType);
  }, [options, index, setValue, questionData?.questionType]);

  const addOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]);
  };

  const removeOption = (optionIndex: number) => {
    if (optionIndex === 0) {
      return;
    }
    setOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== optionIndex)
    );
  };

  const handleOptionChange = (value: string, optionIndex: number) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = value;
    setOptions(updatedOptions);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteFormQuestion(id);
      setLoading(false);
      if (response?.data?.questions) {
        setQuestions(response?.data?.questions);
      }
      toast({
        variant: "destructive",
        description: "Question deleted successfully",
      })
    } catch (err) {
      setLoading(false);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      })
    }
   
  };
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center">
        <Badge className="text-sm rounded-sm flex items-center gap-2 w-fit my-2">
          {questionData.questionType === "checkbox" && (
            <>
              <ListTodo size={"15px"} />
              {"Checkbox"}
            </>
          )}
          {questionData.questionType === "mcq" && (
            <>
              <ListCheck size={"15px"} />
              {"MCQ"}
            </>
          )}
          {questionData.questionType === "dropdown" && (
            <>
              <ChevronDown className="text-sm" />
              {"Dropdown"}
            </>
          )}
        </Badge>
        <Button
          variant={"destructive"}
          disabled={loading}
          onClick={() => handleDelete(questionData._id)}
        >
          {loading ? <Loading /> : "Remove Question"}
        </Button>
      </div>

      <div className="space-y-3">
        <FormField
          control={form.control}
          name={`questions.${index}.questionText`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600 dark:text-gray-100 text-md">
                Question
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="question..."
                  className="py-3 border-gray-600 dark:border-gray-300 text-gray-600 dark:text-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`questions.${index}.questionDescription`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-600  dark:text-gray-100 text-md">
                Description (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="description..."
                  className="border-gray-600 dark:border-gray-300 text-gray-600 dark:text-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options Field Array */}
        {options.map((option, i) => (
          <div key={i} className="flex flex-col gap-2 justify-center">
            <div key={i} className="flex gap-5 items-center">
              <Input
                placeholder={`Option ${i + 1}`}
                className="py-3 border-gray-600 dark:border-gray-300 text-gray-600 dark:text-gray-100"
                value={option}
                onChange={(e) => handleOptionChange(e.target.value, i)}
              />
              {i !== 0 && (
                <Button type="button" onClick={() => removeOption(i)}>
                  Remove Option
                </Button>
              )}
            </div>
            {/* {errors?.questions?.[index]?.options?.[i]?.message && (
              <span className="text-red-500 text-sm">
                {errors.questions[index].options[i].message}
              </span>
            )} */}
          </div>
        ))}
        {/* // Display a single error message if any validation errors are present */}
        {errors?.questions?.[index]?.root?.message && (
      <div className="text-red-500 text-sm">
        {errors.questions[index]?.root?.message}
      </div>
    )}
        <div className="flex flex-col w-full gap-3">
          <Button
            type="button"
            className="w-full md:w-1/6"
            onClick={() => addOption()}
          >
            Add Option
          </Button>
          <Controller
            control={form.control}
            name={`questions.${index}.required`}
            render={({ field: { onChange, value } }) => (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)} // Update the field value based on checkbox state
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Required
                </span>
              </label>
            )}
          />
        </div>
        {/* <Button type="submit">Submit</Button> */}
        {questionData.questionType === "mcq" && (
          <p className="text-sm dark:text-gray-200 my-2 text-gray-500  font-medium">
            Note: User can only give answer in mcq.
          </p>
        )}
        {questionData.questionType === "dropdown" && (
          <p className="text-sm dark:text-gray-200 my-2 text-gray-500  font-medium">
            Note: User can only give answer in dropdown.
          </p>
        )}
        {questionData.questionType === "checkbox" && (
          <p className="text-sm dark:text-gray-200 my-2 text-gray-500  font-medium">
            Note: User can only give answer in checkbox.
          </p>
        )}
      </div>
    </div>
  );
};

export default McqQuest;
