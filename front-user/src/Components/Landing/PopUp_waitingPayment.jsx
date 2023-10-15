import React from 'react'
import {IoMdClose} from "react-icons/io"

const PopUp_waitingPayment = (props) => {
    return (
        <div className=" font-inter relative  flex justify-center flex-col items-center animate-slideup bg-white dark:bg-[#1C1817]  md:w-[40%] w-[60%] h-[33%] rounded-2xl z-[10]   ">
       
    
        <div className='  justify-center items-center flex flex-col w-full gap-6' >
      
            <p className="text-primary text-lg  font-semibold ">
               
            Loading Payment Page
    
             
                </p>
           <p className="text-primary text-sm  ">Please wait while we prepare the payment page...</p>
    
         
    
        
     
        
       
    
        </div>
    </div>
      )
}

export default PopUp_waitingPayment