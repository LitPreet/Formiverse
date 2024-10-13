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
import { Controller, UseFormReturn } from "react-hook-form";
import { Calendar, Clock, Text } from "lucide-react";
import { Question } from "@/lib/types/Form";
import { Link, Mail } from "lucide-react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutationResult,
} from "react-query";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/loader/Loader";
import { Form as FormType } from "@/lib/types/Form";
import { useEffect } from "react";
import { deleteFormQuestion } from "@/api/auth";

interface SimpleTextQuestion {
  questionData: Question;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
  formEditData: FormType;
  setFormEditData: React.Dispatch<React.SetStateAction<FormType>>;
  form: UseFormReturn<{
    heading: string;
    description: string;
    questions?: {
        questionText: string;
        questionDescription: string;
        required: boolean;
        options?: string[] | undefined;
        questionType?: string | undefined;
    }[] | undefined;
}, any, undefined>
index: number;
mutation:UseMutationResult<any, any, string, unknown>
setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
}

const SimpleTextQuestion = ({
  questionData,
  form,
  index,
  mutation,
  setQuestions,
}: SimpleTextQuestion) => {
  const { toast } = useToast();
  const {setValue} = form;
  useEffect(() => {
    setValue(`questions.${index}.questionType`, questionData?.questionType);
    setValue(`questions.${index}.options`, []);
  }, [setValue]);

  
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteFormQuestion(id);

      if (response?.data?.questions) {
        setQuestions(response?.data?.questions);
      } 
      toast({
        variant: "destructive",
        description: "Question deleted successfully",
      })
    } catch (err) {
      console.error(err);
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
          {questionData.questionType === "paragraph" ? (
            <Text className="text-xs" />
          ) : questionData.questionType === "email" ? (
            <Mail className="text-xs" size={"15px"} />
          ) : questionData.questionType === "url" ? (
            <Link className="text-sm" size={"15px"} />
          ) : questionData.questionType === "time" ? (
            <Clock className="text-sm" size={"15px"} />
          ) : questionData.questionType === "date" ? (
            <Calendar className="text-sm" size={"15px"} />
          ) : null}
          {questionData.questionType.charAt(0).toUpperCase() +
            questionData.questionType.slice(1)}
        </Badge>
        <Button
          variant={"destructive"}
          disabled={mutation.isLoading}
          onClick={() => handleDelete(questionData._id)}
        >
          {mutation.isLoading ? <Loading /> : "Remove Question"}
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
      
        {/* <input type="checkbox" value={} className="sr-only peer" /> */}
        {questionData.questionType === "paragraph" && (
          <p className="text-sm dark:text-gray-200 text-gray-500  font-medium">
            Note: User can only give answer in paragraph.
          </p>
        )}
        {questionData.questionType === "date" && (
          <p className="text-sm dark:text-gray-200 text-gray-500  font-medium">
            Note: User can only give answer in time format.
          </p>
        )}
        {questionData.questionType === "email" && (
          <p className="text-sm dark:text-gray-200 text-gray-500  font-medium">
            Note: User can only give answer in email.
          </p>
        )}
        {questionData.questionType === "url" && (
          <p className="text-sm dark:text-gray-200 text-gray-500  font-medium">
            Note: User can only give answer in url.
          </p>
        )}
        {questionData.questionType === "time" && (
          <p className="text-sm dark:text-gray-200 text-gray-500  font-medium">
            Note: User can only give answer in time.
          </p>
        )}

        {/* <Button type="submit">Submit</Button> */}
      </div>
    </div>
  );
};

export default SimpleTextQuestion;
