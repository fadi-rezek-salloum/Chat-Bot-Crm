import React from 'react'
import SignUp from '../Components/SignUp/SignUp'
import LeftContent from '../Components/Layout/LeftContent'

const SignUpPage = () => {
  return (
    <div>
    <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
              <div  className="sm:w-[50%] sm:h-full w-full h-[42%]  ">
              <LeftContent/> 
             
              </div>
              <div className='sm:w-[50%] sm:h-full w-full h-[58%] ' >
               <SignUp/>
            
           </div>
         </div>
 </div>
  
  )
}

export default SignUpPage