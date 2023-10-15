import React,{useState} from 'react'
import {MdEmail} from 'react-icons/md'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SendTokenChangePassword = () => {
    let baseUrl=process.env.REACT_APP_USERS_URL
    const history = useNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        setEmail(e.target.value);
      };

      const handleSubmit = () => {
      
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        
        if (email === "") {
            setEmailError("Enter your Email")
        }else if (!regex.test(email)) {
         
            setEmailError( "This is not a valid email format!")
        }else{
            setIsLoading(true); 
    
            performPassword()
        }
    
      
      
     };

     
  const performPassword = async () => {
    try {
      const response = await axios.post(`${baseUrl}request-password-reset?email=${email}`);

      console.log(response);
      if (response.status === 200) {
        // Sign-up successful
       
        history("/confirm_email" , { state: { email: email , isPasswordReset:true } } )

      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      if(error.response.data.detail ==="User with given email does not exist."){
        setEmailError("email does not exist")
      }
    }
    setIsLoading(false); 

  }
  return (
    <div  className="w-full h-full flex justify-center items-center">
    <div className='flex flex-col gap-2 w-[70%] lg:w-[50%] md:w-[60%] '>
      <p className=' font-semibold text-2xl text-text_primary'>Find your account</p>
      <p className=' text-lg'>Please enter your email address to search for your account.</p>

          <div className='flex flex-col mt-6' >
              <div className={`border  py-2.5 px-5
                flex  justify-start items-center rounded-3xl 
                ${emailError ? 'border-red-500' : ' border-bg-gray_color'}
                
                `}>
              
                <MdEmail className='w-[20px] h-[20px] text-gray_color' />
                
                <input className='focus:outline-none px-2 py-0.5 w-full  '
                  type='email'
                  name="fullName"
                  value={email}
                  onChange={handleChange}
                  placeholder="Email"/>
              
              </div>
              <p className=' text-xs text-red-500 mx-6 '>{emailError}</p>
            </div>

        
          {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary"></div>
          </div>
        ) : (
         <div className='flex gap-3 mt-4'>
             <button className="bg-gray_color py-2 px-6 text-black rounded-3xl w-full"
             onClick={()=>{
                history("/login")
             }}
             >
                  Cancel
           
          </button>
          <button className="bg-secondary py-2 px-6 text-white rounded-3xl w-full" onClick={handleSubmit}>
          Search
          </button>
         </div>
        )}
        
   
      </div>  
    </div>
  )
}

export default SendTokenChangePassword