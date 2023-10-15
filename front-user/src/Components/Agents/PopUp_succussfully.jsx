import React from 'react'
import {IoMdClose} from "react-icons/io"
import Success from '../../Assets/Success.svg'
import error from '../../Assets/error.svg'

const PopUp_succussfully = (props) => {
    return (
        <div className=" relative font-inter  flex justify-center flex-col items-center animate-slideup bg-white dark:bg-[#1C1817]  md:w-[40%] w-[60%] h-[33%] rounded-2xl z-[10]   ">
        <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
          <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />
    
    
        </div>
    
        <div className='  justify-center items-center flex flex-col w-full gap-6' >
            <img className="h-32 w-32" src={
                props.typePopup.type==="succussfuly"?Success : error
                
                
                } alt=''/>
            <p className="text-primary text-sm   ">
              
            
            {props.typePopup.text}
             
                </p>
          
          
    
        
       
    
        </div>
    </div>
      )
}

export default PopUp_succussfully