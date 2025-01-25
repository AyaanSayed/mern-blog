import { Button, TextInput } from 'flowbite-react';
import {useSelector} from 'react-redux';


export default function DashProfile() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-7 text-center text-3xl font-semibold '>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <div className='w-32 h-32 self-center rounded-full overflow-hidden cursor-pointer shadow-md'>
          <img src={currentUser.profilePicture} alt="user" className='w-full h-full object-cover rounded-full border-8 border-[lightgray]' />
        </div>
        <TextInput type='text' placeholder='username' defaultValue={currentUser.username} id='username'  />
        <TextInput type='email' placeholder='email' defaultValue={currentUser.email} id='email'  />
        <TextInput type='password' placeholder='password' id='password'  />
        <Button type='submit'gradientDuoTone='purpleToBlue' outline >Submit</Button>
      </form>
      <div className='flex justify-between mt-5 text-red-500'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
