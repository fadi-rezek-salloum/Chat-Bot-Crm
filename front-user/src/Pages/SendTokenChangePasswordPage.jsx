import React from 'react'
import LeftContent from '../Components/Layout/LeftContent'
import SendTokenChangePassword from '../Components/LogIn/SendTokenChangePassword'

const SendTokenChangePasswordPage = () => {
  return (
    <div>
    <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
              <div  className="sm:w-[50%] sm:h-full w-full h-[42%]  ">
              <LeftContent/> 
             
              </div>
              <div className='sm:w-[50%] sm:h-full w-full h-[58%] ' >
               <SendTokenChangePassword/>
            
           </div>
         </div>
 </div>
  
  )
}

export default SendTokenChangePasswordPage