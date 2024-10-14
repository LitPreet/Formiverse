import { OTP, User } from "@/lib/types/auth"
import {  axiosInstance as axioss } from "./axios"
import { Form, MailFormUrl } from "@/lib/types/Form"


export const registerUser = async (data: FormData) => {
  try {
    const res = await axioss.post('/register', data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
}

export const verifyOTP = async (data: OTP) => {
  try {
    const res = await axioss.post('/verify-otp', data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
}

export const loginUser = async (data: { username: string, email: string; password: string, }) => {

  try {
    const response = await axioss.post('/login', data);
    return response.data
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const getCurrentUser = async (): Promise<User | undefined> => {
  try {
    const response = await axioss.get('/current-user');
    return response.data.data
  } catch (error) {
    console.error('error hai', error);
  }
};

export const handleCreateForm = async (formType:string) => {
  const data = {
    formType: formType,
  }
  try {
    const response = await axioss.post('/create-form',data);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const getFormById = async (formId:string) => {
  const id = formId
  try {
    const response = await axioss.get(`/get-FormById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
  }
};
export const getFormByIdForSubmit = async (formId:string) => {
  const id = formId
  try {
    const response = await axioss.get(`/submit-formView/${id}`);;
    return response.data.data;
  } catch (error:any) {
    throw new Error(error);
    console.error("Error fetchinng form:", error);
  }
};

export const addQuestionToForm = async (formId:string,questionType:string,answerType:string) => {
  try {
    const data = {formId, questionType,answerType}
    const response = await axioss.post(`/add-question`,data);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
  }
};

export const getAllForms = async () => {
  try {
    const response = await axioss.get(`/get-allForms`);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
  }
};

export const deleteFormQuestion = async (questionId:string) => {
  try {
    const response = await axioss.delete(`/delete-question/${questionId}`);
    return response.data;
  } catch (error:any) {
    console.error("Error creating form:", error);
    throw new Error(error);
  }
};

export const SubmitFormBuild = async (formId:string,data:Form) => {
  try {
    const response = await axioss.put(`/update-form/${formId}`, data); // Adjust the URL as per your server config
    return response.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const SubmitFormResponse = async (id:string,data:Form) => {
  const formId = id;
  try {
    const response = await axioss.post(`/submission-form/${formId}`, data); // Adjust the URL as per your server config
    return response.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const getFormSubmissionResponse = async (id:string) => {
  const formId = id;
  try {
    const response = await axioss.get(`/get-FormResponse/${formId}`); 
    return response.data.data;
  } catch (error:any) {
    throw new Error(error);
  }
};

export const getQuestionById = async (questionId:string) => {
  try {
    const response = await axioss.get(`/get-questionById/${questionId}`); 
    return response.data.data;
  } catch (error:any) {
    throw new Error(error);
  }
};

export const deleteResponseById = async (formId:string) => {
  try {
    const response = await axioss.delete(`/deletform-response/${formId}`); 
    return response.data.data;
  } catch (error:any) {
    throw new Error(error);
  }
};

export const deleteFormById = async (formId:string) => {
  try {
    const response = await axioss.delete(`/delete-form/${formId}`); 
    return response.data.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const sendFormLinkMail = async (data:MailFormUrl) => {
  try {
    const response = await axioss.post(`/send-formUrl`,data); 
    return response.data.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};


export const forgotPasswordSendOtp = async (data:{email:string}) => {
  try {
    const response = await axioss.post(`/send-password-reset-otp`,data); 
    return response.data.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const verifyforgotPasswordSendOtp = async (data:{email:string,otp:string,newPassword:string}) => {
  try {
    const response = await axioss.post(`/verify-otp-and-change-password`,data); 
    return response.data.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

export const verifyAuth = async () => {
  try {
    const response = await axioss.get(`/check-auth`); 
    return response.data.data;
  } catch (error:any) {
    if (error.response) {
      throw error.response; 
    }
    throw error; 
  }
};

