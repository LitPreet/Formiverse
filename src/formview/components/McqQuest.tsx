import { deleteFormQuestion } from "@/api/auth";
import { Loading } from "@/components/loader/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Question } from "@/lib/types/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ListCheck, ListTodo, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "react-query";
import { z } from "zod";

const formSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  description: z.string().optional(),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(1, {
    message: "At least one option is required.",
  }),
});
type FormSchema = z.infer<typeof formSchema>;
const McqQuest = ({
  questionData,
  refetch,
}: {
  questionData: Question;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}) => {
  const [options, setOptions] = useState<string[]>([""]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      description: "",
      options: [],
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // Sync question options with the incoming data
  useEffect(() => {
    setOptions(questionData.options || [""]);
  }, [questionData]);

  const addOption = () => {
    setOptions([...options, ""]);
  };
  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };
  const mutation = useMutation({
    mutationFn: async (questionId: string) =>
      await deleteFormQuestion(questionId),
    onSuccess: (data: any) => {
      refetch();
      toast({
        title: "Question Deleted Successfully",
      });
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
    },
  });
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center">
        <Badge className="text-sm rounded-sm flex items-center gap-2 w-fit my-2">
          {questionData.questionType === "checkbox" && (
            <>
              <ListTodo size={'15px'}/>
              {"Checkbox"}
            </>
          )}
          {questionData.questionType === "mcq" && (
            <>
              <ListCheck size={'15px'}/>
              {"MCQ"}
            </>
          )}
          {questionData.questionType === "dropdown" && (
            <>
              <ChevronDown className="text-sm"/>
              {"Dropdown"}
            </>
          )}
        </Badge>
        <Button
          variant={"destructive"}
          disabled={mutation.isLoading}
          onClick={() => mutation.mutate(questionData._id)}
        >
          {mutation.isLoading ? <Loading /> : "Remove Question"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="question"
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
            name="description"
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
          {options.map((option, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`options.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 dark:text-gray-100 text-md">
                    Option {index + 1}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-5 w-full md:w-[60%] items-center">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        className="py-3 border-gray-600 dark:border-gray-300 text-gray-600 dark:text-gray-100"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="text-sm" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="button" onClick={() => addOption()}>
            Add Option
          </Button>
          {/* <Button type="submit">Submit</Button> */}
        </form>
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
      </Form>
    </div>
  );
};

export default McqQuest;
