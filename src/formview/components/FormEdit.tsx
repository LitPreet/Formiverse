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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { addQuestionToForm, getFormById } from "@/api/auth";
import { useParams } from "react-router-dom";
import { Loading } from "@/components/loader/Loader";
import { useEffect, useRef, useState } from "react";
import { ShimmerFormView } from "@/components/loader/Shimmer";

const FormEdit = () => {
  const { id } = useParams();

  const { data, error, isLoading, isError, refetch } = useQuery(
    ["getFormById", id], // `formId` as a dependency
    async () => await getFormById(id!),
    {
      enabled: !!id,
    }
  );

  const mutation = useMutation({
    mutationFn: async ({
      id,
      questionType,
    }: {
      id: string;
      questionType: string;
    }) => {
      return await addQuestionToForm(id, questionType);
    },
    onSuccess: (data: any) => {
      refetch();
      console.log("Question added successfully", data);
      
    },
    onError: (error: any) => {
      // Handle error, e.g., show an error message
      console.error("Error adding question", error);
    },
  });

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [dropdownRef]);

  return (
    <div className="max-w-7xl w-full  flex justify-center flex-col gap-5  items-center">
      {isLoading ? (
        <ShimmerFormView />
      ) : (
        <>
          <div className="flex flex-col w-[90%] md:w-[70%] rounded-lg px-3 py-3 shadow-lg border border-gray-500 dark:border-gray-100">
            <input
              type="text"
              defaultValue={data?.data?.heading}
              placeholder="form heading...."
              className="font-bold text-3xl my-3  border-b-2 border-b-gray-500 bg-transparent outline-none text-gray-600 dark:text-gray-100"
            />
            <input
              type="text"
              defaultValue={data?.data?.description}
              placeholder="form description...."
              className="font-semibold text-xl  border-b-2 border-b-gray-500 bg-transparent outline-none text-gray-600 dark:text-gray-100"
            />
          </div>
          {data?.data?.questions &&
            data?.data?.questions.map((question: any, index: number) => (
              <div
                key={index}
                className="flex flex-col w-[90%] md:w-[70%] rounded-lg px-3 py-3 shadow-lg border border-gray-500 dark:border-gray-100"
              >
                {question.questionType === "mcq" ||
                question.questionType === "checkbox" ||  question.questionType === "dropdown" ? (
                  <McqQuest questionData={question} refetch={refetch}/>
                ) : (
                  <SimpleTextQuestion questionData={question} refetch={refetch}/>
                )}
              </div>
            ))}

          {/* <Button><Plus className="text-sm mr-1"/> Add Question</Button> */}
          <div
            className="flex justify-start w-[70%] relative"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={mutation.isLoading}>
                  {mutation.isLoading ? (
                    <><Loading />Add Question</> // Show the loading indicator when loading
                  ) : (
                    <>
                      <Plus className="text-sm mr-1" />
                      Add Question
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full p-0">
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                    onClick={() =>
                      mutation.mutate({ id: id!, questionType: "mcq" })
                    }>
                <ListCheck className="text-sm" /> Multiple Choice
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                    onClick={() =>
                      mutation.mutate({ id: id!, questionType: "paragraph" })
                    }>
                <Text className="text-sm " />Text
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                    onClick={() =>
                      mutation.mutate({ id: id!, questionType: "url" })
                    }>
                 <Link className="text-sm " /> URL
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                    onClick={() =>
                      mutation.mutate({ id: id!, questionType: "email" })
                    }>
               <Mail className="text-sm" />
               Email
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                    onClick={() =>
                      mutation.mutate({ id: id!, questionType: "checkbox" })
                    }>
                <ListTodo className="text-sm" /> Check Box
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                   onClick={() =>
                    mutation.mutate({ id: id!, questionType: "date" })
                  }
                >
                  <Calendar className="text-sm" /> Date
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                   onClick={() =>
                    mutation.mutate({ id: id!, questionType: "time" })
                  }
                >
                   <Clock className="text-sm" />
                   time
                </DropdownMenuItem >
                <DropdownMenuItem  className="flex border-none justify-start items-center gap-2"
                   onClick={() =>
                    mutation.mutate({ id: id!, questionType: "dropdown" })
                  }
                >
                   <ChevronDown className="text-sm" />
                   Dropdown
                </DropdownMenuItem >
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
};

export default FormEdit;
