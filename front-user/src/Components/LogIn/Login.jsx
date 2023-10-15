import React,{useContext} from 'react'
import {RiLockPasswordFill} from 'react-icons/ri'
import { useState, useEffect } from "react";

import {BsFillPersonFill} from 'react-icons/bs'
import { HiEye, HiEyeOff } from 'react-icons/hi'; 

import axios from 'axios';
import { useNavigate , Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useStateContext } from "../../contexts/MessgeContext";
import {  toast } from 'react-toastify';
import PopUp_payment from "../Payment/PopUp_payment"
const Login = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const {setAuthTokens , setIsPayment  , setUser  ,setHere 
    , setNotificationCount , getSocialMedia } = useContext(AuthContext)
  const { getNotifications   } = useStateContext()

  let url_Login=`${baseUrl}token`
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState(false);

  const [descriptionPopup, setDescriptionPopup] = useState("Your free trial is over");




  const [isLoading, setIsLoading] = useState(false);


  const initialValues = {  fullName: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const history = useNavigate();

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
  
    const errors = validate(formValues);

    setFormErrors(errors);

  
    // If there are no form errors, proceed with API call
    if (Object.keys(errors).length === 0 ) {
      setIsLoading(true); // Start loading indicator

      performLogIn();
    }
  };


  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 ) {
      console.log(formValues);
    }
  }, [formErrors]);



  const validate = (values) => {
    const errors = {};
  
    if (!values.fullName) {
      errors.fullName = "Enter your full name";
      
    }
    if (!values.password) {
      errors.password = "Enter your password";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }
    return errors;
  };

  const performLogIn = async () => {
    try {

     
  

      const response = await axios.post(url_Login, 
      {
        "password":  formValues.password,
        "username": formValues.fullName
      }
      
      );

      if (response.status === 200) {
        // Sign-up successful
        console.log(response.data);

        setUserData({
          access : response.data.access,
          is_subscription_expired : response.data.is_subscription_expired,
          is_trial_active : response.data.is_trial_active,
          is_trial_expired : response.data.is_trial_expired,
          refresh : response.data.refresh,
          role : response.data.role,
          notifications_count : response.data.notifications_count,
          user_id : response.data.user_id,
          username : response.data.username,

        })
        setNotificationCount(response.data.notifications_count)
        getSocialMedia()
        if(response.data.role !== "admin"){
          toast.success('You have successfully logged in')
       
         
          if(((response.data.is_trial_active && response.data.is_trial_expired))  ){
            
            setDescriptionPopup("Your free trial is over")
            setIsPayment(false)

            setShowPopup(true)
          }else if(!response.data.is_trial_active && response.data.is_subscription_expired){
            setShowPopup(true)
            setIsPayment(false)

            setDescriptionPopup("Your subscription is over")
          }else{
            setUser(userData)
            setIsPayment(true)
            setHere(true)
            setAuthTokens(response.data.access)
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);

            getNotifications(response.data.access)
            history('/dashboard' , { state: { login:"true" } } );

            if(response.data.role==="owner"){
              history('/dashboard' , { state: { login:"true" } } );
            }else{
              history('/settings' , { state: { login:"true" } } );

            }
            getSocialMedia()

          }
          
       
        }else{
          toast.error('You do not have the permission to access')

        }
      

       



       

        // Redirect or show success message
      }
    } catch (error) {
     

      
      toast.error('No active account found with the given credentials')

    




      
    }
    setIsLoading(false); // Stop loading indicator

  }




  return (
    <div  className="w-full h-full flex justify-center items-center">
    <div className='flex flex-col gap-2 w-[70%] lg:w-[50%] md:w-[60%] '>
      <p className=' font-semibold text-2xl text-text_primary'>Welcome back !</p>
      <p className=' text-lg'>Time to dive back into the action</p>
      <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}  
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
>

          <div>
              <div className={`border  py-2.5 px-5
                flex  justify-start items-center rounded-3xl 
                ${formErrors.fullName ? 'border-red-500' : ' border-bg-gray_color'}
                
                `}>
              
                <BsFillPersonFill className='w-[20px] h-[20px] text-gray_color' />
                
                <input className='focus:outline-none px-2 py-0.5 w-full  '
                  type='text'
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                placeholder="Username"/>
              
              </div>
              <p className=' text-xs text-red-500 mx-6 '>{formErrors.fullName}</p>
            </div>

          <div>
          <div className={`border  py-2.5 px-5
              flex  justify-start items-center rounded-3xl 
              ${formErrors.password ? 'border-red-500' : ' border-bg-gray_color'}
              
              `}>
            
              <RiLockPasswordFill className='w-[20px] h-[20px] text-gray_color'  />
              <input className='focus:outline-none px-2 py-0.5 w-full  '
                    type={showPassword ? 'text' : 'password'}

                     name="password"    
                     value={formValues.password}
                     onChange={handleChange}   
              placeholder="Password"/>
               <button
        onClick={togglePasswordVisibility}
      >
              {showPassword ?
               <HiEye className='w-[20px] h-[20px] text-gray_color' /> : 
               <HiEyeOff className='w-[20px] h-[20px] text-gray_color' />}
      </button>

            </div>
          
              <div className='flex justify-between mx-6'>
              <p className=' text-xs text-red-500  '>{formErrors.password}</p>
              <p className='text-xs text-text_primary font-medium cursor-pointer'
                onClick={()=>{   history('/login/identify');}}
              >Forgot password?</p>
              </div>
          </div>
          {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary"></div>
          </div>
        ) : (
          <button className="bg-secondary py-2 px-6 text-white rounded-3xl w-full">
            LogIn
          </button>
        )}
        
      </form>
   
      <div className='flex flex-col items-center mt-4'>
          <hr className='border-t border-bg-gray_color w-3/4' />
          <p className='text-text_primary text-sm mt-4'>
            Don't have an account? 
            <span className='text-primary font-medium cursor-pointer'>
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
          
     


   

    


    </div>

    {showPopup && (
        <div className=" fixed left-0 top-0 w-[100%] 
         h-screen bg-black 
         bg-opacity-60 backdrop-blur-[1px] 
         z-[9999] flex justify-center items-center  ">
         



                
                <PopUp_payment
                setShowPopup={setShowPopup}
            
                descriptionPopup = {descriptionPopup}
                userData = {userData}
                />
            
           
           
        
          
        </div>
      )
      
      
      
      }
  </div>
  )
}

export default Login