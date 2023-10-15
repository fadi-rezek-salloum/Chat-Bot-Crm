import React,{useState , useContext , useEffect} from 'react'
import {MdEmail} from 'react-icons/md'
import {RiLockPasswordFill  } from 'react-icons/ri'
import {BsFillPersonFill , BsFillTelephoneFill} from 'react-icons/bs'
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Icons for visibility toggle
import  AuthContext  from "../contexts/AuthContext";
import axios from 'axios';
import Loader from './Loader'
import {  toast } from 'react-toastify';
const Settings = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  let url_saveChanged=`${baseUrl}owner/details`
  let url_changepassword=`${baseUrl}change-password`


    const {authTokens , user , setUser} = useContext(AuthContext)
    const [formValues, setFormValues] = useState(user);
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [loading,setLoading]=useState(false)
    const [loadingPassword,setLoadingPassword]=useState(false)


    useEffect(() => {
      if(!formValues.first_name){
      
        getUser()
      }
    }, []); 
   
    const togglePasswordVisibility = (e) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };
 

    const handlePhoneNumberChange = (event) => {
      const { name, value } = event.target;
      // Remove non-digit characters
      const sanitizedValue = value.replace(/\D/g, '');
  
     
      setFormValues({ ...formValues, [name]: sanitizedValue });
  
      
    };


    const handleSubmit = (e) => {
      e.preventDefault();
     
    
      const errors = validate(formValues);
  
      setFormErrors(errors);
  
    
      // If there are no form errors, proceed with API call
      if (Object.keys(errors).length === 0 ) {
  
        Save_Change();
      }
    };

    const handleSubmit_password = (e) => {
      e.preventDefault();
     
    
      const errors = validate_password(formValues);
  
      setFormErrors(errors);
  
    
      // If there are no form errors, proceed with API call
      if (Object.keys(errors).length === 0 ) {
  
        Change_Password();
      }
    };

      
  const validate = (values) => {
    const errors = {};
    if (!values.first_name) {
      errors.first_name = "Enter your First Name";
    }
    
    if (!values.last_name) {
      errors.last_name = "Enter your Last Name";
    }

    if (!values.phone_number) {
      errors.phone_number = "Enter your Phone Number";
    }

  
   

    if(values.set_password && values.rewrite_password && values.set_password!==values.rewrite_password){
      errors.rewrite_password = "Passwords do not match";
      errors.set_password = "Passwords do not match";

    }
   
    
    return errors;
  };


  const validate_password = (values) => {
    const errors = {};
    if (!values.old_password) {
      errors.old_password = "Enter your old Password";
    }
    
    if (!values.new_password) {
      errors.new_password = "Enter your  new Password";
    }

 

  
   

    if(values.old_password && values.new_password && values.old_password===values.new_password){
      errors.new_password = "The password does not match.";
      errors.old_password = "The password does not match.";

    }
   
    
    return errors;
  };

  const Save_Change = async () => {
    setLoading(true);
  
      try {
        const response = await axios.put(url_saveChanged, 
        {
          "first_name":  formValues.first_name,
          "last_name":  formValues.last_name,
          "phone_number":  formValues.phone_number,
  
  
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
        console.log(response)
        console.log(response.status)
  
        if (response.status === 200) {
             toast.success("Your information has been changed successfully.")
          // Sign-up successful
          setUser({
            ...user, 
            "first_name":  formValues.first_name,
            "last_name":  formValues.last_name,
            "phone_number":  formValues.phone_number,
          });
          
        }
      } catch (error) {
        toast.error("An error occurred, please try again.")
          console.log(error)
      
          
         
        
      }
    

    setLoading(false); 

 


  }

  const Change_Password = async () => {
    setLoadingPassword(true);
  
      try {
        const response = await axios.post(url_changepassword, 
        {
          old_password:  formValues.old_password,
          new_password:  formValues.new_password,
    
  
  
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
   
        if (response.status === 200) {
             toast.success("Your password has been changed successfully")
          // Sign-up successful
          
          
        }
      } catch (error) {
        toast.error(error.response.data.detail)
      
          
         
        
      }
    

      setLoadingPassword(false); 

 


  }


  const getUser= async ()=>{ 

    
    try{
      let res  = await axios.get(`${baseUrl}owner/details`,
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      )
      if (res.status === 200) {
        // Sign-up successful
      
        setUser(res.data.user)
        setFormValues(res.data.user)
          // setUser(res.data.agent)
        // Redirect or show success message
      }

    }
    catch(e){
      
     
    }
  }
  return (
    <div className=" font-inter pl-14  pr-6 relative  flex  justify-center
    flex-col  animate-slideup dark:bg-[#1C1817]
      w-full h-full rounded-2xl  ">
        
  <div className='pr-11 flex flex-col w-[100%] justify-between gap-8 mt-8'>
    <div className='flex  gap-8 w-full '>
        <div className='w-[50%]'>
        <div className={`border  py-2.5 px-5 w-full
          flex  justify-start items-center rounded-3xl   
          ${formErrors.first_name ? 'border-red-500' : ' border-bg-gray_color'}
            
          `}>
        
          <BsFillPersonFill className='w-[20px] h-[20px] text-gray_color' />
          
          <input className='focus:outline-none px-2 py-0.5 w-full  '
                 type='text'
                 name="first_name"    
                 value={formValues.first_name}
                 onChange={handleChange}
                 placeholder="First name"/>
        
        </div>
        <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.first_name}</p>
        </div>
        <div className='w-[50%]'>
        <div className={`border  py-2.5 px-5  w-full
          flex  justify-start items-center rounded-3xl   
          ${formErrors.last_name ? 'border-red-500' : ' border-bg-gray_color'}
            
          `}>
        
          <BsFillPersonFill className='w-[20px] h-[20px] text-gray_color' />
          
          <input className='focus:outline-none px-2 py-0.5 w-full  '
                   type='text'
                   name="last_name"    
                   value={formValues.last_name}
                   onChange={handleChange}
          placeholder="Last name"/>
        
        </div>
        <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.last_name}</p>
        </div>
     
       
    </div>
    <div className='flex gap-8 w-full'>
       <div className='w-[50%]'>
        <div className={`border  py-2.5 px-5
          flex  justify-start items-center rounded-3xl   w-full    
          ${formErrors.phone_number ? 'border-red-500' : ' border-bg-gray_color'}
         
          `}>
        
          <BsFillTelephoneFill className='w-[20px] h-[20px] text-gray_color' />
          
          <input className='focus:outline-none px-2 py-0.5 w-full  '
                  type='text'
                  name="phone_number"   maxLength={10}
                  // value={formValues.phone_number}
                  // onChange={handleChange}
                  value={formValues.phone_number}
                  onChange={handlePhoneNumberChange}
           placeholder="Phone number"/>
        
        </div>
        <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.phone_number}</p>
        </div>
        <div className={`border  py-2.5 px-5
          flex  justify-start items-center rounded-3xl  w-[50%] bg-slate-100             
          `}>
        
          <MdEmail className='w-[20px] h-[20px] text-gray_color ' />
          
          <input className='focus:outline-none px-2 py-0.5 w-full  bg-slate-100'
                 type='email'
                 name="email"    
                 value={formValues.email}
                 onChange={handleChange}
                 readOnly
          placeholder="Email Address"/>
        
        </div>
     
     
    </div>

    {loading ? <div className="mt-8"> <Loader /> </div>    :
      <div className='flex shadow-lg text-white  w-max 
      shadow-primary-500/50     px-10 py-3 
      bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

  rounded-3xl     justify-start items-center gap-1 cursor-pointer'
  onClick={handleSubmit}
  >
    
      Save changes
  </div>
    }
  




    <div className='flex gap-8 w-full'>
    <div className='w-[50%]'>
        <div className={`border  py-2.5 px-5
          flex  justify-start items-center rounded-3xl    w-full 
          ${formErrors.old_password ? 'border-red-500' : ' border-bg-gray_color'}
           
          `}>
        
          <RiLockPasswordFill className='w-[20px] h-[20px] text-gray_color' />
          
          <input className='focus:outline-none px-2 py-0.5 w-full  '
                    type={showPassword ? 'text' : 'password'}

                    name="old_password"    
                    value={formValues.old_password}
                    onChange={handleChange}   
                    placeholder="Old Password"/>
        
        <button
          onClick={togglePasswordVisibility}
        >
                {showPassword ?
                 <HiEye className='w-[20px] h-[20px] text-gray_color' /> : 
                 <HiEyeOff className='w-[20px] h-[20px] text-gray_color' />}
        </button>
        </div>
        <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.old_password}</p>
        </div>
        <div className='w-[50%]'>
        <div className={`border  py-2.5 px-5
          flex  justify-start items-center rounded-3xl  w-full     
          ${formErrors.new_password ? 'border-red-500' : ' border-bg-gray_color'}
        
          `}>
        
          <RiLockPasswordFill className='w-[20px] h-[20px] text-gray_color' />
          
          <input className='focus:outline-none px-2 py-0.5 w-full  '
                    type={showPassword ? 'text' : 'password'}

                    name="new_password"    
                    value={formValues.password}
                    onChange={handleChange}   
             placeholder="New Password"/>
           <button
          onClick={togglePasswordVisibility}
        >
                {showPassword ?
                 <HiEye className='w-[20px] h-[20px] text-gray_color' /> : 
                 <HiEyeOff className='w-[20px] h-[20px] text-gray_color' />}
        </button>
        </div>
        <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.new_password}</p>
        </div>
     
     
    </div>
  </div>



  {loadingPassword ? <div className="mt-8 w-[90%]"> <Loader /> </div>    :
      <div className='flex shadow-lg text-white  w-max mt-8
      shadow-primary-500/50     px-10 py-3 
      bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

  rounded-3xl     justify-start items-center gap-1 cursor-pointer'
  onClick={handleSubmit_password}
  >
    
    Change Password
  </div>
    }
           

          
</div>
  )
}

export default Settings