import React from 'react'
import Login from '../Components/LogIn/Login'
import LeftContent from '../Components/Layout/LeftContent'

const LogInPage = () => {
  return (
    <div>
    <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
              <div  className="sm:w-[50%] sm:h-full w-full h-[50%]  ">
              <LeftContent/> 
             
              </div>
              <div className='sm:w-[50%] sm:h-full w-full h-[50%] ' >
               <Login/>
            
           </div>
         </div>
 </div>
  )
}

export default LogInPage