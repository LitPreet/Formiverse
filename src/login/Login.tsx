import LoginForm from '@/components/forms/loginForm'

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
    <div className="grid  md:grid-cols-2  items-center gap-4 max-w-6xl w-full">
      <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)]">
        <LoginForm />
      </div>
      <div className="lg:h-[400px] md:h-[300px] max-md:mt-8 hidden md:block">
      <img
        src="https://readymadeui.com/login-image.webp"
        className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
        alt="Dining Experience"
      />
    </div>
    </div>
   
  </div>
  )
}

export default Login
