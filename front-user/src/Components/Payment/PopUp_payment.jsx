import React,{useContext} from 'react'
import error from '../../Assets/error.svg'
import AuthContext from "../../contexts/AuthContext";
import { useNavigate , Link } from "react-router-dom";
import { useStateContext } from "../../contexts/MessgeContext";

const PopUp_payment = (props) => {
  const {setAuthTokens   , setUser ,    setHere } = useContext(AuthContext)
  const { getNotifications  } = useStateContext()

  const history = useNavigate();

  return (
    <div className=" relative font-inter py-8  flex justify-center flex-col items-center animate-slideup bg-white dark:bg-[#1C1817]  md:w-[40%] w-[60%] h-max rounded-2xl z-[10]   ">
   

    <div className='  justify-center items-center flex flex-col w-full gap-6' >
        <img className="h-32 w-32" src={ error} alt=''/>
        <p className="text-primary text-sm   ">
        {props.descriptionPopup}
       
            </p>
    </div>
    <div className=' flex justify-end items-center w-[80%] gap-6 mt-8' >
    <div  className=' text-primary border border-primary 
                 w-full
                 
                    py-4
                  rounded-[32px]
                    flex items-center justify-center '>
                <button 
                onClick={()=>{
                  props.setShowPopup(false)
                  history('/');
                }
              
              
              } 
                >
                   Return to home page
                </button>

   </div>
{
  props.userData.role==="owner" && 
  <div   className=' text-white 
  w-full
  bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
     py-4
     rounded-[32px]
    flex items-center justify-center shadow-md ' >        
 <button 
 

    onClick={()=>{
       setUser(props.userData)
       setAuthTokens(props.userData.access)
       localStorage.setItem('accessToken', props.userData.access);
       localStorage.setItem('refreshToken', props.userData.refresh);
       getNotifications(props.userData.access)
        setHere(true)
       history('/plans');



    }}
    
    >
   Pay for a plan
 </button>
</div> 
}
     
               
               

         </div>
</div>
  )
}

export default PopUp_payment