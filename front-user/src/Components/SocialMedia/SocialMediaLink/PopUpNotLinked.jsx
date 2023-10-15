import React from 'react'
import {IoMdClose} from "react-icons/io"

const PopUpNotLinked = (props) => {
  return (
    <div className=" font-inter relative  flex justify-center flex-col items-center animate-slideup bg-white dark:bg-[#1C1817]  md:w-[40%] w-[60%] h-[33%] rounded-2xl z-[10]   ">
    <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
      <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />


    </div>

    <div className='  justify-center items-center flex flex-col w-full gap-6' >
  
        <p className="text-red-500 text-lg  font-semibold ">
           
       
 {
  props.detailPopup.title
 }
         
            </p>
       <p className="text-primary text-sm   w-[90%] text-center">  {
  props.detailPopup.desc
 }</p>

     

        <div className=' w-full flex flex-row gap-6 justify-center items-center' >
       

        <div className=' flex justify-end items-center w-[30%] gap-6 ' >
                <button 
                onClick={()=>{props.setShowPopup(false)}} 
                className=' text-white 
                 w-full
                 bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
                    py-4
                  rounded-3xl
                    flex items-center justify-center ' >
                   OKI
                </button>


                
            
                
               
               

         </div>
    </div>
 
    
   

    </div>
</div>
  )
}

export default PopUpNotLinked