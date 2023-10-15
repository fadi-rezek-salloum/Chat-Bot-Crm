import React,{useContext} from 'react'
import { useState, useEffect } from "react";
import {RiLockPasswordFill} from 'react-icons/ri'
import {BsFillPersonFill} from 'react-icons/bs'

import {MdEmail} from 'react-icons/md'
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Icons for visibility toggle

import axios from 'axios';
import { useNavigate , Link } from "react-router-dom";


import AuthContext from "../../contexts/AuthContext";

const SignUp = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  let url_SignUp=`${baseUrl}owner`

  const [isLoading, setIsLoading] = useState(false);

  const initialValues = { fullName: "", email: "", password: "" };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);

    setFormErrors(errors);

  
    // If there are no form errors, proceed with API call
    if (Object.keys(errors).length === 0 ) {
      setIsLoading(true); // Start loading indicator

      performSignUp();
    }
   
 
  };

  const performSignUp = async () => {
    try {

     
  

      const response = await axios.post(url_SignUp, 
      {
        "username": formValues.fullName,
        "password":  formValues.password,
        "email": formValues.email
      }
      
      );

      if (response.status === 201) {
        // Sign-up successful
        console.log('User registered successfully.');
        history('/confirm_email', { state: { email: formValues.email } });

        // Redirect or show success message
      }
    } catch (error) {
      console.error('Error during sign-up:', error.response.data.message);
      if(error.response.data.message === "Username already exists"){

        setFormErrors({fullName:error.response.data.message})
      }
      // Handle error, show error message, etc.
      if(error.response.data.message === "Email already exists"){

        setFormErrors({email:error.response.data.message})
      }



      
    }
    setIsLoading(false); // Stop loading indicator

  }

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0) {
      console.log(formValues);
  
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    console.log(values);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fullName) {
      errors.fullName = "Enter your full name";
      
    }
    if (!values.email) {
      errors.email = "Entrer your email address";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Enter your password";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }
    return errors;
  };




  return (
    <div  className="w-full h-full flex justify-center items-center">
       <div className='flex flex-col gap-2 w-[70%] lg:w-[50%] md:w-[60%] '>
        <p className=' font-semibold text-2xl'>Register</p>
        <p className=' text-lg'>Join our vibrant community by registering today</p>
        <form className='flex flex-col gap-4 mt-6' onSubmit={handleSubmit}
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
                ${formErrors.email ? 'border-red-500' : ' border-bg-gray_color'}
                
                `}>
              
                <MdEmail className='w-[20px] h-[20px] text-gray_color' />
                
                <input className='focus:outline-none px-2 py-0.5 w-full  '
                       type='email'
                       name="email"    
                       value={formValues.email}
                       onChange={handleChange}
                placeholder="Email Address"/>
              
              </div>
              <p className=' text-xs text-red-500 mx-6 '>{formErrors.email}</p>
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
              <p className=' text-xs text-red-500 mx-6 '>{formErrors.password}</p>
            </div>
            {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary"></div>
          </div>
        ) : (
          <button className="bg-secondary py-2 px-6 text-white rounded-3xl w-full">
            Register
          </button>
        )}
          
        </form>
     
       
        <div className='flex flex-col items-center mt-4'>
          <hr className='border-t border-bg-gray_color w-3/4' />
          <p className='text-text_primary text-sm mt-2'>
            you have an account? 
            <span className='text-primary font-medium cursor-pointer'>
              <Link to="/login">Log In</Link>
            </span>
          </p>
        </div>

     

      


      </div>
    </div>
  )
}

export default SignUp