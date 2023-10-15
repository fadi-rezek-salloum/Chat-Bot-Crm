import React,{useContext} from 'react'
import {RiLockPasswordFill} from 'react-icons/ri'
import { useState, useEffect } from "react";

import {BsFillPersonFill} from 'react-icons/bs'
import { HiEye, HiEyeOff } from 'react-icons/hi'; 

import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Loader from '../Loader';
import {  toast } from 'react-toastify';

const Login = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const {setAuthTokens , setIsPayment ,setAgent , setNotificationCount, getNotifications } = useContext(AuthContext)

  let url_Login=`${baseUrl}token`
 



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
       
       

        if(response.data.role === "admin"){
          setAuthTokens(response.data.access)
          localStorage.setItem('accessTokenAdmin', response.data.access);
          localStorage.setItem('refreshTokenAdmin', response.data.refresh);
           setNotificationCount(response.data.notifications_count)
          history('/dashboard');
          getNotifications( response.data.access)
          toast.success('You have successfully logged in')
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
    <div className="w-full h-full flex justify-center items-center">
    <div className="flex flex-col gap-2   w-[65%]">
      <p className="font-semibold text-2xl text-text_primary">Welcome back!</p>
      <p className="text-lg">Login to admin panel</p>
      <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}
         onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e);
          }
        }}
      >
        <div>
          <div
            className={`border py-2.5 px-5 flex justify-start items-center rounded-3xl ${
              formErrors.fullName ? 'border-red-500' : 'border-bg-gray_color'
            }`}
          >
            <BsFillPersonFill className="w-5 h-5 text-gray_color" />
            <input
              className="focus:outline-none px-2 py-0.5 w-full"
              type="text"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>
          <p className="text-xs text-red-500 mx-6">{formErrors.fullName}</p>
        </div>
        <div>
          <div
            className={`border py-2.5 px-5 flex justify-start items-center rounded-3xl ${
              formErrors.password ? 'border-red-500' : 'border-bg-gray_color'
            }`}
          >
            <RiLockPasswordFill className="w-5 h-5 text-gray_color" />
            <input
              className="focus:outline-none px-2 py-0.5 w-full"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button onClick={togglePasswordVisibility}>
              {showPassword ? (
                <HiEye className="w-5 h-5 text-gray_color" />
              ) : (
                <HiEyeOff className="w-5 h-5 text-gray_color" />
              )}
            </button>
          </div>
          <div className="flex justify-between mx-6">
            <p className="text-xs text-red-500">{formErrors.password}</p>
            <p className="text-xs text-text_primary font-medium cursor-pointer">
              Forgot password?
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
                <Loader />
          </div>
        ) : (
          <button className="bg-secondary py-2 px-6 text-white rounded-3xl w-full">
            LogIn
          </button>
        )}
      </form>
    </div>
  </div>
  
  )
}

export default Login