import { Button } from '../ui/button'
import { ModeToggle } from '../toggle-theme/toggle-theme'
import Logo from '@/assets/images/formLogo.png'
import Profile from '../profile/profile'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useNavigate } from 'react-router-dom'
import { useRoutePath } from '@/hooks/useRoutePath'


const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const path = useRoutePath()
  const navigate = useNavigate()
  return (
    <div className='z-10 shadow-md flex bg-transparent p-3 justify-between items-center dark:text-white text-gray-600 relative dark:bg-gray-700'>
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(path.home)}>
      <img src={Logo} className='w-10 h-10 object-contain' fetchPriority='high' alt='logo'/>
      <h1 className='text-xl dark:text-white text-gray-600 font-bold'>Formiverse</h1>
    </div>
    <div className="flex items-center gap-3">
      <ModeToggle />
      {user ? (
        <>
          <div style={{ position: 'relative', zIndex: 20 }}>
            <Profile user={user} />
          </div>
        </>
      ) : (
        <div className='flex gap-3 items-center'>
          <Button onClick={() => navigate(path.login)} variant={"default"}>Login</Button>
          {/* <Button onClick={() => navigate(path.registerUser)} variant={"secondary"}>Sign Up</Button> */}
        </div>
      )}
    </div>
  </div>
  

  )
}

export default Header
