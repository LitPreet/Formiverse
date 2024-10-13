import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { getFormByIdForSubmit, SubmitFormResponse } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer/Footer";
import { Question } from "@/lib/types/Form";
import { useToast } from "@/hooks/use-toast";
import { ShimmerFormView } from "@/components/loader/Shimmer";
import ToggleForm from "./components/ToggleForm";

type SubmitFormValues = {
  answers: { questionId: string; answer?: string }[];
};
const SubmitForm = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery(
    ["getFormById", id],
    () => getFormByIdForSubmit(id!),
    { enabled: !!id }
  );

  const responseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await SubmitFormResponse(id, data);
    },
    onSuccess: () => {
      setFormSubmitted(true);
      toast({
        variant: "default",
        description: "Response Submitted successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    },
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { control, handleSubmit, setError, clearErrors } =
    useForm<SubmitFormValues>({
      defaultValues: {
        answers:
          data?.questions.map((question: Question) => ({
            questionId: question._id,
            answer: "",
            questionText: ""
          })) || [],
      },
    });
  const onSubmit = (values: SubmitFormValues) => {
    const errors: string[] = [];

    // Manually validate required questions
    data?.questions.forEach((question: Question, index: number) => {
      const answer = values.answers[index]?.answer;

      if (question.required && !answer) {
        errors.push(question._id); // Add questionId to errors if required field is empty
        setError(`answers.${index}.answer`, {
          message: "This question is required",
        });
      } else {
        clearErrors(`answers.${index}.answer`); // Clear error if answer is provided
      }
    });

    // Update validation errors state
    setValidationErrors(errors);

    if (errors.length === 0) {
      console.log("Form submitted with values:", values);

      const formattedData = {
        answers: values.answers.map((ans, index) => ({
          question: ans.questionId,
          answer: ans.answer,
          type: data.questions[index].answerType,
          questionText:data.questions[index].questionText,
        })),
      };
      responseMutation.mutate({
        id: id!,
        data: formattedData,
      });

      // Call submission API or handle submission here
    }
  };

  const handleSubmitAnotherResponse = () => {
    setFormSubmitted(false); // Reset state to show the form again
    clearErrors(); // Clear any validation errors
  };

  if (error) return <div>Error loading form</div>;

  console.log(validationErrors, "im error");
  return (
    <div className="w-full relative flex justify-start  flex-col gap-2 min-h-screen items-center">
      {formSubmitted ? (
        <ToggleForm handleSubmitAnotherResponse={handleSubmitAnotherResponse}/>
      ) : (
        <>
          {" "}
          {isLoading ? (
            <ShimmerFormView />
          ) : (
            <>
              {" "}
              <div className="max-w-7xl w-full mb-2 flex justify-start  flex-col gap-2 items-center">
                <div className="flex flex-col w-[90%] md:w-[50%] my-4 rounded-lg px-3 py-3  shadow-lg border border-gray-500 dark:border-gray-100">
                  <h1 className="my-1 font-bold text-3xl text-center dark:text-gray-200 text-gray-800">
                    {data && data.heading}
                  </h1>
                  <h3 className="my-0 text-xl dark:text-gray-200 text-center text-gray-600">
                    {data && data.description}
                  </h3>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-7xl w-full mb-5 flex justify-start  flex-col gap-2 items-center"
              >
                {data?.questions.map((question: Question, index: number) => (
                  <div
                    key={question._id}
                    className="flex space-y-3 flex-col w-[90%] md:w-[50%] rounded-lg px-3 py-3  shadow-lg border border-gray-500 dark:border-gray-100"
                  >
                    <div className="flex gap-1">
                      <h2 className="text-xl font-semibold mb-2 dark:text-gray-100 text-gray-700 flex items-center gap-2">
                        <span className="text-gray-500 flex items-center dark:text-gray-200">
                          {index + 1}
                        </span>{" "}
                        {question.questionText}
                      </h2>
                      {question.required && (
                        <p className="text-xl text-red-500">{"*"}</p>
                      )}
                    </div>

                    {question.questionType === "paragraph" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div className="relative z-0 w-full mb-5 group">
                            <input
                              type={question.questionType}
                              {...field}
                              id="answers"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                            />
                            <label
                              htmlFor="answers"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Enter your answer
                            </label>
                          </div>
                        )}
                      />
                    )}

                    {question.questionType === "email" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div className="relative z-0 w-full mb-5 group">
                            <input
                              type={question.questionType}
                              {...field}
                              id="email"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                            />
                            <label
                              htmlFor="email"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              email
                            </label>
                          </div>
                        )}
                      />
                    )}
                    {question.questionType === "date" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            type="date"
                            {...field}
                            className="w-fit border dark:border-gray-200 dark:text-gray-200 text-black border-black"
                          />
                        )}
                      />
                    )}
                    {question.questionType === "time" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            type="time"
                            {...field}
                            className="w-fit border dark:border-gray-200 dark:text-gray-200 text-black border-black"
                          />
                        )}
                      />
                    )}
                    {question.questionType === "url" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            type="url"
                            {...field}
                            placeholder="enter the url..."
                            className="w-fit border dark:border-gray-200 dark:text-gray-200 text-black border-black"
                          />
                        )}
                      />
                    )}
                    {question.questionType === "dropdown" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <select
                            {...field}
                            className="my-2 border outline-none w-fit p-1 border-gray-300"
                          >
                            {question.options &&
                              question.options.map((option: string) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                          </select>
                        )}
                      />
                    )}

                    {question.questionType === "checkbox" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        render={({ field }) => (
                          <>
                            {question.options?.map((option: string) => (
                              <ul
                                key={option}
                                className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              >
                                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                  <div className="flex items-center ps-3">
                                    <input
                                      id={`checkbox-${option}`}
                                      checked={
                                        Array.isArray(field.value) &&
                                        field.value.includes(option)
                                      }
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        // Ensure that field.value is an array of strings, or default to an empty array
                                        const currentValue =
                                          (field.value as unknown as string[]) ||
                                          [];

                                        if (checked) {
                                          field.onChange([
                                            ...currentValue,
                                            option,
                                          ]);
                                        } else {
                                          field.onChange(
                                            currentValue.filter(
                                              (val) => val !== option
                                            )
                                          );
                                        }
                                      }}
                                      type="checkbox"
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                      htmlFor={`checkbox-${option}`}
                                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            ))}
                          </>
                        )}
                      />
                    )}

                    {question.questionType === "mcq" && (
                      <Controller
                        name={`answers.${index}.answer`}
                        control={control}
                        render={({ field }) => (
                          <>
                            {question.options?.map((option: string) => (
                              <div
                                className="flex items-center ps-3 m-0"
                                key={option}
                              >
                                <input
                                  id={`mcq-${option}`}
                                  checked={field.value === option}
                                  onChange={() => field.onChange(option)}
                                  type="radio"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                  htmlFor={`mcq-${option}`}
                                  className="w-full py-1 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </>
                        )}
                      />
                    )}
                    <Controller
                      name={`answers.${index}.questionId`}
                      control={control}
                      defaultValue={question._id}
                      render={({ field }) => <input type="hidden" {...field} />}
                    />
                     {/* <Controller
                      name={`answers.${index}.questionId`}
                      control={control}
                      defaultValue={question.questionText}
                      render={({ field }) => <input type="hidden" {...field} />}
                    /> */}
                    {validationErrors.includes(question._id) && (
                      <p className="text-red-500 text-sm">
                        This question is required
                      </p>
                    )}
                  </div>
                ))}

                <Button type="submit" className="my-4">
                  Submit
                </Button>
              </form>
            </>
          )}
        </>
      )}

      <div className="bottom-0 absolute">
        <Footer />
      </div>
    </div>
  );
};

export default SubmitForm;