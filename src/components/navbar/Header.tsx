import { logout } from '@/features/auth/authSlice'
import { useRoutePath } from '@/hooks/useRoutePath'
import { RootState } from '@/store/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user)
  const path = useRoutePath()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = () => {
    // Call your logout action here
    localStorage.removeItem('authenticated')
    dispatch(logout());
    
    // Optionally, clear cookies or perform additional cleanup
    // Redirect to login or home page
    navigate(path.home);
  };
  return (
    <div className='flex  p-5 justify-between items-center text-white'>
    <h1>Logo</h1>
    <div className="">
    {user ? (
      <>
        <span>Welcome, {user.fullName}!</span>
        <button onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <div className='flex gap-3 items-center'>
        <Button onClick={() => navigate(path.login)} variant={"default"}>Login</Button>
        <Button onClick={() => navigate(path.registerUser)} variant={"secondary"}>Sign Up</Button>
      </div>
    )}
    </div>
  </div>

  )
}

export default Header
