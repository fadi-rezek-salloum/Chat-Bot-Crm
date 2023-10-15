import React,{useState , useContext} from 'react'
import {IoMdClose} from "react-icons/io"
import {MdEmail} from 'react-icons/md'
import {BsFillPersonFill } from 'react-icons/bs'
import {RiLockPasswordFill } from 'react-icons/ri'
import { HiEye, HiEyeOff } from 'react-icons/hi'; 
import Loader from '../Loader'
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";

import {  toast } from 'react-toastify';
const Settings = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const {authTokens} = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false);


  const [formValues, setFormValues] = useState({});
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
   
  
   
    setIsLoading(true); // Start loading indicator

    ChangePassword();
  
  };
  const ChangePassword = async () => {
    try {



      const response = await axios.post(`${baseUrl}change-password`, 
      {
        old_password: formValues.old_password,
        new_password: formValues.new_password
      }
      ,{
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      
      );

      if (response.status === 200) {
        // Sign-up successful
        console.log(response.data);
       
        toast.success(response.data.detail)


       


       

        // Redirect or show success message
      }
    } catch (error) {
     

  

      toast.error(error.response.data.detail)

      
    }
    setIsLoading(false); // Stop loading indicator

  }




  return (
    <div className=" font-inter px-10  py-9 relative  flex  justify-center  
    flex-col  animate-slideup  dark:bg-[#1C1817]
      w-full h-full rounded-2xl  ">
      
  <div className=' flex w-[100%] justify-between items-center gap-8 mt-8'>
    <div className='flex flex-col gap-4 w-[50%] '>
   
     
        <div
            className={`border py-2.5 px-5 flex justify-start items-center rounded-3xl 
            border-bg-gray_color
            `}
          >
            <RiLockPasswordFill className="w-5 h-5 text-gray_color" />
            <input
              className="focus:outline-none px-2 py-0.5 w-full"
              type={showPassword ? 'text' : 'password'}
              name="old_password"
              value={formValues.old_password}
              onChange={handleChange}
              placeholder="old Password"


            />
            <button onClick={togglePasswordVisibility}>
              {showPassword ? (
                <HiEye className="w-5 h-5 text-gray_color" />
              ) : (
                <HiEyeOff className="w-5 h-5 text-gray_color" />
              )}
            </button>
          </div>
    </div>
    <div className='flex flex-col gap-4 w-[50%]'>
      
     
        <div
            className={`border py-2.5 px-5 flex justify-start items-center rounded-3xl 
            border-bg-gray_color
            `}
          >
            <RiLockPasswordFill className="w-5 h-5 text-gray_color" />
            <input
              className="focus:outline-none px-2 py-0.5 w-full"
              type={showPassword ? 'text' : 'password'}
              name="new_password"
              value={formValues.new_password}
              onChange={handleChange}
              placeholder="New Password"
            />
            <button onClick={togglePasswordVisibility}>
              {showPassword ? (
                <HiEye className="w-5 h-5 text-gray_color" />
              ) : (
                <HiEyeOff className="w-5 h-5 text-gray_color" />
              )}
            </button>
          </div>
    </div>
  </div>




  {isLoading ? (
          <div className="flex justify-center items-center  mt-8">
                <Loader />
          </div>
        ) : (
          <div className='flex shadow-lg text-white  w-max     mt-8
          shadow-primary-500/50     px-10 py-3 
          bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
          rounded-3xl   justify-start items-center gap-1 cursor-pointer'
          onClick={handleSubmit}
          >
        
          Save changes
      </div>
        )}
           


             {/* Checkboxes for social media platforms */}
          
</div>
  )
}

export default Settings