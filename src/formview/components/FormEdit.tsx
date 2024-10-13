import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronDown,
  Clock,
  Link,
  ListCheck,
  ListTodo,
  Mail,
  Plus,
} from "lucide-react";
import McqQuest from "./McqQuest";
import SimpleTextQuestion from "./SimpleTextQuestion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { addQuestionToForm, deleteFormQuestion, getFormById, SubmitFormBuild } from "@/api/auth";
import { FormEncType, useParams } from "react-router-dom";
import { Loading } from "@/components/loader/Loader";
import { useEffect, useState } from "react";
import { ShimmerFormView } from "@/components/loader/Shimmer";
import { Form as FormType, Question } from "@/lib/types/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "@/lib/schemas/auth.schema";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";


const FormEdit = () => {
  const { id } = useParams();
  const [formEditData, setFormEditData] = useState<FormType>({
    heading: "",
    description: "",
    questions: [],
  });
  const [questions, setQuestions] = useState<Question[]>([]); // Local state for questions
  const { toast } = useToast()

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["getFormById", id], // `formId` as a dependency
    async () => await getFormById(id!),
    {
      enabled: !!id,
      onSuccess: (data) => {
        const { description, heading, questions } = data.data;
        setQuestions(questions); // Set initial questions
        form.reset({
          description: description,
          heading: heading,
          questions: questions.map((question: Question) => ({
            _id: question._id,
            questionText: question.questionText || "",
            questionDescription: question.questionDescription || "",
            questionType: question.questionType || "",
            options: question.options && question.options.length > 0 ? question.options : [""],
            required: question.required ?? false,
          })),
        });
      },
    }
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      heading: "",
      questions: [],
    },
  });

  const {
    formState: { errors },
    setValue,
  } = form;

  const mutationforFormSubmit = useMutation({
    mutationFn: async ({
      formId,
      formEditData,
    }: {
      formId: string;
      formEditData: FormType;
    }) => {
      return await SubmitFormBuild(formId, formEditData);
    },
    onSuccess: (data: any) => {
      toast({
        variant: "default",
        className:"text-black dark:text-white",
        description: "Form Edited Successfully",
      })

    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      toast({
        variant: "destructive",
        description: "Error submitting form",
      })
      console.error("Error adding question", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (questionId: string) => await deleteFormQuestion(questionId),
    onSuccess: (data:any) => {
      const updatedForm = data.data;
      setQuestions(updatedForm.questions);
      toast({
        variant: "destructive",
        description: "Question deleted successfully!",
      })
    },
    onError: (error: any) => {
      console.error("Error:", error);
    }
  });


  useEffect(() => {
    setValue("heading", data?.data?.heading);
    setValue("description", data?.data?.description);
  }, [data,setValue]);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      questionType,
      answerType,
    }: {
      id: string;
      questionType: string;
      answerType: 'single' | 'multiple';
    }) => {
      return await addQuestionToForm(id, questionType,answerType);
    },
    onSuccess: (data: any) => {
      // refetch();
      const newQuestion: Question = {
        _id: data.data._id, // assuming the backend returns the new question with an ID
        form: data.data.form,
        questionText: data.data.questionText,
        questionDescription: data.data.questionDescription,
        questionType: data.data.questionType,
        options: [], // Initialize options if necessary
        required: data.data.required,
        createdAt: data.data.createdAt, // if the backend returns timestamps
        updatedAt: data.data.updatedAt,
      };
      setQuestions((prevQuestions=[]) => [...prevQuestions, newQuestion]);
      toast({
        description: "Question added successfully",
      })
      console.log("Question added successfully", data);
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      toast({
        description: "Something went wrong!",
      })
      console.error("Error adding question", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalData = {
      heading: values.heading,
      description: values.description,
      questions: values.questions && values.questions.map((question, index) => ({
        ...question, // Spread form question data (without _id)
        _id: questions[index]._id, // Add `_id` from the existing `questions` state
      })),
    };
    mutationforFormSubmit.mutate({ formId: id!, formEditData: finalData as FormType });
  }

  return (
    <div className="max-w-7xl w-full  flex justify-center flex-col gap-5  items-center">
      {isLoading ? (
        <ShimmerFormView />
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              // border border-gray-500 dark:border-gray-100
              className="flex space-y-3 flex-col w-[90%] md:w-[70%] rounded-lg px-3 py-3"
            >
              <div className="flex  flex-col w-full md:w-full rounded-lg px-3 py-3  shadow-lg border border-gray-500 dark:border-gray-100">
                <Controller
                  control={form.control}
                  name="heading"
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="form heading...."
                      className="font-bold text-xl  md:text-3xl my-3  border-b-2 border-b-gray-500 bg-transparent outline-none text-gray-600 dark:text-gray-100"
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="form description...."
                      className="font-semibold text-sm md:text-xl  border-b-2 border-b-gray-500 bg-transparent outline-none text-gray-600 dark:text-gray-100"
                      {...field}
                    />
                  )}
                />
              </div>
              {questions &&
                questions.map((question: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col w-full md:w-full rounded-lg px-3 py-3 shadow-lg border border-gray-500 dark:border-gray-100"
                  >
                    {question.questionType === "mcq" ||
                    question.questionType === "checkbox" ||
                    question.questionType === "dropdown" ? (
                      <McqQuest
                        questionData={question}
                        refetch={refetch}
                        setFormEditData={setFormEditData}
                        formEditData={formEditData}
                        form={form}
                        index={index}
                        questions={questions}
                        setQuestions={setQuestions}
                        mutation={deleteMutation}
                      />
                    ) : (
                      <SimpleTextQuestion
                        questionData={question}
                        refetch={refetch}
                        setFormEditData={setFormEditData}
                        formEditData={formEditData}
                        form={form}
                        setQuestions={setQuestions}
                        index={index}
                        mutation={deleteMutation}
                      />
                    )}
                  </div>
                ))}
              <div className="flex w-full justify-center items-center">
                <Button className="w-1/4">Submit</Button>
              </div>
            </form>
          </Form>

          {/* <Button><Plus className="text-sm mr-1"/> Add Question</Button> */}
          <div className="flex justify-start w-[70%] relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={mutation.isLoading}>
                  {mutation.isLoading ? (
                    <>
                      <Loading />
                      Add Question
                    </> // Show the loading indicator when loading
                  ) : (
                    <>
                      <Plus className="text-sm mr-1" />
                      Add Question
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full p-0">
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "mcq",answerType:'single' })
                  }
                >
                  <ListCheck className="text-sm" /> Multiple Choice
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "paragraph",answerType:'single' })
                  }
                >
                  <Text className="text-sm " />
                  Text
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "url",answerType:'single' })
                  }
                >
                  <Link className="text-sm " /> URL
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "email",answerType:'single' })
                  }
                >
                  <Mail className="text-sm" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "checkbox",answerType:'multiple' })
                  }
                >
                  <ListTodo className="text-sm" /> Check Box
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "date",answerType:'single' })
                  }
                >
                  <Calendar className="text-sm" /> Date
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "time",answerType:'single' })
                  }
                >
                  <Clock className="text-sm" />
                  time
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex border-none justify-start items-center gap-2"
                  onClick={() =>
                    mutation.mutate({ id: id!, questionType: "dropdown",answerType:'single' })
                  }
                >
                  <ChevronDown className="text-sm" />
                  Dropdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
};

export default FormEdit;
