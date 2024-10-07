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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, Clock, Text } from "lucide-react";
import { Question } from "@/lib/types/Form";
import { Link, Mail } from "lucide-react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "react-query";
import { deleteFormQuestion } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/loader/Loader";

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

const SimpleTextQuestion = ({
  questionData,
  refetch,
}: {
  questionData: Question;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}) => {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (questionId: string) =>
      await deleteFormQuestion(questionId),
    onSuccess: (data: any) => {
      refetch()
      toast({
        title: "Question Deleted Successfully",
      });
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      console.error("Registration error", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center">
        <Badge className="text-sm rounded-sm flex items-center gap-2 w-fit my-2">
          {questionData.questionType === "paragraph" ? (
            <Text className="text-xs"/>
          ) : questionData.questionType === "email" ? (
            <Mail className="text-xs"size={'15px'}/>
          ) : questionData.questionType === "url" ? (
            <Link className="text-sm" size={'15px'}/>
          ) : questionData.questionType === "time" ? (
            <Clock className="text-sm" size={'15px'}/>
          ) : questionData.questionType === "date" ? (
            <Calendar className="text-sm" size={'15px'}/> 
          ) : null}
          {questionData.questionType.charAt(0).toUpperCase() +
            questionData.questionType.slice(1)}
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
        </form>
      </Form>
    </div>
  );
};

export default SimpleTextQuestion;
