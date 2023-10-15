import React from 'react'
import { useNavigate } from "react-router-dom";

const Account_verified = ({resulte}) => {
  const history = useNavigate();

  return (
    <div className='w-full h-full flex items-center justify-center font-inter'>
        <div className='flex flex-col gap-4 w-[60%]'>

        <p className=' font-semibold text-2xl text-primary'>{resulte.title}</p>
        <p className=' text-lg text-text_primary'>{resulte.desc}</p>
        <button 
            className='bg-secondary py-3 px-6 mt-3 text-white rounded-3xl w-full cursor-pointer'
            onClick={()=>{
              history("/login")
            }}
          >Go to login page</button>    
          
          
    </div>
    </div>
  )
}

export default Account_verified