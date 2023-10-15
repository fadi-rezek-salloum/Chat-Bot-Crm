import React from 'react'
import LeftContent from '../Components/Layout/LeftContent'
import Email_verification from '../Components/SignUp/Email_verification'

const ConfirmEmailPage = () => {
  return (
    <div>
    <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
              <div  className="sm:w-[50%] sm:h-full w-full h-[50%]  ">
              <LeftContent/> 
             
              </div>
              <div className='sm:w-[50%] sm:h-full w-full h-[50%] ' >
               <Email_verification/>
            
           </div>
         </div>
 </div>
  )
}

export default ConfirmEmailPage