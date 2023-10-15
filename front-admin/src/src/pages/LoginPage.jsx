import React from 'react'
import LeftContent from '../components/Layout/LeftContent'
import Login from '../components/Login/Login'

const LoginPage = () => {
  return (
    <div>
       <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
                 <div  className="sm:w-[50%] sm:h-full w-full h-[40%]  ">
                 <LeftContent/> 
                
                 </div>
                 <div className='sm:w-[50%] sm:h-full w-full h-[60%] ' >
                  <Login/>
               
              </div>
            </div>
    </div>
  )
}

export default LoginPage