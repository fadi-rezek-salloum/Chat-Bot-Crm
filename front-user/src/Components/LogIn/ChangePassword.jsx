import React from 'react'
import {RiLockPasswordFill} from 'react-icons/ri'
import { useState, useEffect } from "react";

import { HiEye, HiEyeOff } from 'react-icons/hi'; 
import axios from 'axios';
import {  toast } from 'react-toastify';
import { useNavigate  } from "react-router-dom";

const ChangePassword = ({token , uid}) => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const [loading,setLoading]=useState(false)
  const history = useNavigate();
    const initialValues = {  password: "", password_confirmation: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };
  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      changePassowrd()
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    console.log(values);
  
 
    if (!values.password) {
      errors.password = "Enter your password";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }

    if (!values.password_confirmation) {
      errors.password_confirmation = "Entrer your password";
    } else if (values.password.length < 4) {
      errors.password_confirmation = "Entrer your password";
    }

   
    if(values.password && values.password_confirmation && 
      values.password!==values.password_confirmation){
      errors.password = "The password does not match.";
      errors.password_confirmation = "The password does not match.";

    }
    



    return errors;
  };





  const changePassowrd = async () => {
    setLoading(true);
      try {  
        const response = await axios.post(`${baseUrl}reset-password/${token}/${uid}/`,
        {
          new_password:formValues.password
        }
        );
      //   props.setShowPopup(false)
     
      toast.success('The password has been changed successfully.')


        if (response.status === 200) {
        
         
          history('/login');

          }
      } catch (error) {
      
          console.log(error)

          toast.error('An error occurred, please retry.')


  
     
        
      }
      setLoading(false); 
  
    }
  return (
    <div  className="w-full h-full flex justify-center items-center">
    <div className='flex flex-col gap-2 w-[50%]'>
      <p className=' font-semibold text-2xl text-text_primary'>Account verified !</p>
      <p className=' text-lg'>Now you cant change your password</p>
      <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}>

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
          
              <p className=' text-xs text-red-500  mx-6'>{formErrors.password}</p>
              
          </div>

          <div>
          <div className={`border  py-2.5 px-5
              flex  justify-start items-center rounded-3xl 
              ${formErrors.password ? 'border-red-500' : ' border-bg-gray_color'}
              
              `}>
            
              <RiLockPasswordFill className='w-[20px] h-[20px] text-gray_color'  />
              <input className='focus:outline-none px-2 py-0.5 w-full  '
                    type={showPassword ? 'text' : 'password'}

                     name="password_confirmation"    
                     value={formValues.password_confirmation}
                     onChange={handleChange}   
              placeholder="Rewrite Password"/>
               <button
        onClick={togglePasswordVisibility}
      >
              {showPassword ?
               <HiEye className='w-[20px] h-[20px] text-gray_color' /> : 
               <HiEyeOff className='w-[20px] h-[20px] text-gray_color' />}
      </button>

            </div>
          
              <p className=' text-xs text-red-500  mx-6'>{formErrors.password_confirmation}</p>
              
          </div>
          {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary"></div>
          </div>
        ) : (
          <button 
          className='bg-secondary py-3 px-6 text-white rounded-3xl w-full'

        >Change password</button>
        
        )}
      
      </form>
   
     


   

    


    </div>
  </div>
  )
}

export default ChangePassword