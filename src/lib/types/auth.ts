export interface RegisterUser{
    username:string;
    fullName:string;
    email: string;
    password: string;
}
export interface LoginUser{
    username:string;
    email:string;
    password:string;
}

export interface User {
    _id?: string; // Optional field if you expect ObjectId from MongoDB
    username: string;
    email: string;
    fullName: string;
    coverImage?: string; // Optional field
    watchHistory?: string[]; // Array of Video ObjectIds (or string if you use ObjectId as a string)
    createdAt?: string; // Optional if timestamps are included
    updatedAt?: string; // Optional if timestamps are included
  }

  export interface OTP {
    email:string | null;
    otp:string
  }