import React,{useState , useEffect , useContext} from 'react'
import {IoMdClose} from "react-icons/io"
import {MdPersonAddAlt1 } from 'react-icons/md'

import {RiLockPasswordFill} from 'react-icons/ri'
import {BsFillPersonFill , BsFillTelephoneFill , BsChevronDown} from 'react-icons/bs'

import {MdEmail} from 'react-icons/md'
import { HiEye, HiEyeOff } from 'react-icons/hi';
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import Loader from '../Loader'
import {  toast } from 'react-toastify';
const PopUp_addAgent = (props) => {
  let baseUrl=process.env.REACT_APP_DEPARTMENTS_URL
  let url_AGENT=`${baseUrl}agents/`
  





  const {authTokens} = useContext(AuthContext)

  const [isOpen, setIsOpen] = useState(false);
  const findDepartmentId = (nameToFind) => {
    for (const department of props.departments) {
      if (department.label === nameToFind) {
        console.log( department.value)
        return department.value;
      }
    }
    return ""; // Return null if the department is not found
  };
  const [selectedOption, setSelectedOption] = useState({
    label: props.typePopup.type==="Edit"
    ? props.agentSelect.department_name
    : "",
    value: props.typePopup.type==="Edit"
    ? findDepartmentId(props.agentSelect.department_name)
    : "",

  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading,setLoading]=useState(false)
  const [formValues, setFormValues] = useState(
    props.typePopup.type==="Edit"
    ? props.agentSelect
    : {}
    );
    console.log( props.agentSelect)
    // setSelectedOption()
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };


  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

 

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };




const Add_agent = async () => {
    setLoading(true);
  
      try {
        const response = await axios.post(url_AGENT, 
        {
          "password":  formValues.set_password,
          "username":  formValues.username,
          "first_name":  formValues.first_name,
          "last_name":  formValues.last_name,
          "phone_number":  formValues.phone_number,
          "email":  formValues.email,
          "department_id":  parseInt(selectedOption.value)
  
  
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
        console.log(response)
        console.log(response.status)
  
        if (response.status === 201) {
          // Sign-up successful
          const resulte = [...props.agents,
            { 
              department_id:   response.data.agent.department_id,
              department_name:   response.data.agent.department_name,
              email:   response.data.agent.email,
              first_name:   response.data.agent.first_name,
              last_name:   response.data.agent.last_name,
  
              username:  response.data.agent.username,
              phone_number:   response.data.agent.phone_number,
              id:  response.data.agent.id,
              is_active : true,
  
           
           }]
          props.setAgents(resulte);
  
           props.setAgentsorignal(resulte)
  
          props.setTypePopup(
            {
              type:"succussfuly",
              text:"The agent was added succussfully"
          }
  
          )
        }
      } catch (error) {
      
          console.log(error)
          if(error.response.data.message === "Username already exists"){

            setFormErrors({username:error.response.data.message})
          }else if(error.response.data.message === "Email already exists"){

            setFormErrors({email:error.response.data.message})
          } else{
            props.setTypePopup(
              {
                type:"error",
                text:"An error accured while adding the agent"
            })
          }
          
         
        
      }
    

    setLoading(false); 

 


  }

  const update_agent = async () => {
    setLoading(true);
    console.log(`${url_AGENT}${props.agentSelect.id}/`)
      try {
        const response = await axios.put(`${url_AGENT}${props.agentSelect.id}/`, 
        {
          "password":  formValues.set_password,
          "username":  formValues.username,
          "first_name":  formValues.first_name,
          "last_name":  formValues.last_name,
          "phone_number":  formValues.phone_number,
          "email":  formValues.email,
          "department_id":  parseInt(selectedOption.value)
  
  
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
          // Sign-up successful

          const updatedAgent = props.agents.map((agent) => {
            if (agent.id === props.agentSelect.id) {
              return { ...agent,
                department_id:parseInt(selectedOption.value),
                department_name:selectedOption.label,
                email:formValues.email,
                first_name:formValues.first_name,
                last_name:formValues.last_name,
    
                username:  formValues.username,
                phone_number:   formValues.phone_number,
            
             
              };
            }
            return agent;
          });
      
          props.setAgents(updatedAgent);
          props.setAgentsorignal(updatedAgent)



  
          props.setTypePopup(
            {
              type:"succussfuly",
              text:"The agent was updated succussfully"
          }
  
          )
        }
      } catch (error) {
      
          console.log(error)
          if(error.response.data.message === "Username already exists"){

            setFormErrors({username:error.response.data.message})
          }else if(error.response.data.message === "Email already exists"){

            setFormErrors({email:error.response.data.message})
          } else{
            props.setTypePopup(
              {
                type:"error",
                text:"An error accured while updating the agent"
            })
          }
          
         
        
      }
    

    setLoading(false); 

 


  }

    
  const validate = (values) => {
  
    
    if( props.typePopup.type==="Edit"){
      setSelectedOption(
        {
          label: props.agentSelect.department_name , 
          value:findDepartmentId(props.agentSelect.department_name)
        }
      )
    }
 
    const errors = {};
    if (!values.username) {
      errors.username = "Enter your username";
    }
    
    if (!values.email) {
      errors.email = "Enter your email";
    }

    if (!values.set_password) {
      errors.set_password = "Enter your password";
    } else if (values.set_password.length < 4) {
      errors.set_password = "Password must be more than 4 characters";
    }

    if (!values.rewrite_password) {
      errors.rewrite_password = "Enter your password";
    } else if (values.rewrite_password.length < 4) {
      errors.rewrite_password = "Password must be more than 4 characters";
    }

    if (!selectedOption.value) {
      errors.department = "Select a Department"
    }

    if(values.set_password && values.rewrite_password && values.set_password!==values.rewrite_password){
      errors.rewrite_password = "Passwords do not match";
      errors.set_password = "Passwords do not match";

    }
   
    
    return errors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
   
  
    const errors = validate(formValues);

    setFormErrors(errors);

  
    // If there are no form errors, proceed with API call
    if (Object.keys(errors).length === 0 ) {
      if( props.typePopup.type==="Edit"){
        update_agent()
      }
      else{
        Add_agent();
      }
    
    }
  };

  const handlePhoneNumberChange = (event) => {
    const { name, value } = event.target;
    // Remove non-digit characters
    const sanitizedValue = value.replace(/\D/g, '');

    if (sanitizedValue.length === 10) {
      // It's a valid 10-digit number
    
    } else {
 
    }
    setFormValues({ ...formValues, [name]: sanitizedValue });

    
  };
    

    return (
        <div className=" font-inter pl-14  py-9 pr-3 relative  flex  justify-start items-center 
        flex-col  animate-slideup bg-white dark:bg-[#1C1817]
          md:w-[75%] w-[75%] h-max rounded-2xl z-[10]   ">
        <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
            <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />

        
        </div>
    
       
       


      <div className='pr-11 flex flex-col w-full justify-between items-center gap-4 mt-8'>
        <div className='flex  gap-10 w-full '>
            <div className='w-[50%]'>
              <div className={`border  py-2.5 px-5
                flex  w-full  justify-start items-center rounded-3xl   
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

              <div className={`border  py-2.5 px-5 w-full
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

        <div className='flex  gap-10 w-full '> 
          <div className='w-[50%]'>

          <div className={`border  py-2.5 px-5 w-full
            flex  justify-start items-center rounded-3xl   
            ${formErrors.username ? 'border-red-500' : ' border-bg-gray_color'}

            `}>

            <BsFillPersonFill className='w-[20px] h-[20px] text-gray_color' />
            
            <input className='focus:outline-none px-2 py-0.5 w-full  '
                  type='text'
                  name="username"    
                  value={formValues.username}
                  onChange={handleChange}
            placeholder="Username"/>

          </div>
          <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.username}</p>

          </div>
          <div className='w-[50%]'>

              <div className={`border  py-2.5 px-5 w-full
                flex  justify-start items-center rounded-3xl   
                ${formErrors.email ? 'border-red-500' : ' border-bg-gray_color'}
              
                `}>
              
                <MdEmail  className='w-[20px] h-[20px] text-gray_color' />
                
                <input className='focus:outline-none px-2 py-0.5 w-full  '
                     type='email'
                     name="email"    
                     value={formValues.email}
                     onChange={handleChange}
              placeholder="Email Address"/>

              </div>
              <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.email}</p>

            </div>
        </div>
       
        <div className='flex  gap-10 w-full '> 
            <div className='w-[50%]'>
            <div className={`border  py-2.5 px-5
              flex  justify-start items-center rounded-3xl   
              ${formErrors.department ? 'border-red-500' : ' border-bg-gray_color'}

              `}
              
              >
            
              <BsFillPersonFill className='w-[20px] h-[20px] text-gray_color' />
              
                 {/* Replace the input with a dropdown */}
                 <div className='relative w-full '
                 onClick={() => setIsOpen(!isOpen)}
               >
               
               <input className='focus:outline-none px-2 py-0.5 w-full  
                text-black cursor-pointer'
                    type='text'
                    name="departement"    
                    value={selectedOption.label}
                     // onChange={handleChange}
                   readOnly
                   placeholder= 'Select a Department'

             />

               {isOpen && (
                 <ul className="absolute z-10 bg-white border border-gray-300 mt-1 
                 w-full max-h-[250px] py-2 rounded-md shadow-md overflow-y-auto">
                   {props.departments.map((option) => (
                     <li
                       key={option.value}
                       className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleOptionClick(option)}
                     >
                       {option.label}
                     </li>
                   ))}
                 </ul>
               )}
           </div>

           <BsChevronDown
 className={`w-[20px] h-[20px] text-gray_color ${isOpen ? 'transform rotate-180' : ''}`}
/>
           </div>
              <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.department}</p>

            </div>
             <div className='w-[50%]'>
              <div className={`border  py-2.5 px-5
                flex  w-full  justify-start items-center rounded-3xl   
                ${formErrors.phone_number ? 'border-red-500' : ' border-bg-gray_color'}
              
                `}>
              
                <BsFillTelephoneFill className='w-[20px] h-[20px] text-gray_color' />
                
                <input className='focus:outline-none px-2 py-0.5 w-full  '
                         type='text' 
                         name="phone_number"    
                         placeholder="Phone number"
                         value={formValues.phone_number}
                         onChange={handlePhoneNumberChange}
                       />

              </div>
              <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.phone_number}</p>

            </div>
        </div>


        <div className='flex  gap-10 w-full '> 
            <div className='w-[50%]'>
            <div className={`border  py-2.5 px-5
             flex  justify-start items-center rounded-3xl   
             ${formErrors.set_password ? 'border-red-500' : ' border-bg-gray_color'}            
             `}>
           
             <RiLockPasswordFill className='w-[20px] h-[20px] text-gray_color' />
             
             <input className='focus:outline-none px-2 py-0.5 w-full  '
                    type={showPassword ? 'text' : 'password'}
                    name="set_password"    
                    value={formValues.set_password}
                    onChange={handleChange}
                   placeholder="Set password"
             
             />
             <button
         onClick={togglePasswordVisibility}
       >
               {showPassword ?
                <HiEye className='w-[20px] h-[20px] text-gray_color' /> : 
                <HiEyeOff className='w-[20px] h-[20px] text-gray_color' />}
       </button>
           </div>
              <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.set_password}</p>

            </div>
            <div className='w-[50%]'>

            <div className={`border  py-2.5 px-5
             flex  justify-start items-center rounded-3xl    
             ${formErrors.rewrite_password ? 'border-red-500' : ' border-bg-gray_color'}            
           
             `}>
           
             <RiLockPasswordFill className='w-[20px] h-[20px] text-gray_color' />
             
             <input className='focus:outline-none px-2 py-0.5 w-full  '
                  type={showPassword ? 'text' : 'password'}
                  name="rewrite_password"    
                  value={formValues.rewrite_password}
                  onChange={handleChange}
              placeholder="Rewrite password"
             
             />
             <button
         onClick={togglePasswordVisibility}
       >
               {showPassword ?
                <HiEye className='w-[20px] h-[20px] text-gray_color' /> : 
                <HiEyeOff className='w-[20px] h-[20px] text-gray_color' />}
       </button>
           </div>
              <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.rewrite_password}</p>

            </div>
        </div>
      </div>


      {loading ? <div className="mt-8"> <Loader /> </div>    :

                <div className='flex shadow-lg text-white  w-max     mt-8
                shadow-primary-500/50     px-10 py-4 
                bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

            rounded-3xl    items-center justify-center gap-1 cursor-pointer'
            onClick={handleSubmit} 

            >
                <MdPersonAddAlt1/>
                 {
                   props.typePopup.type==="Edit"
                   ? "Update agent"
                   : "Add new agent"
                 }
                
            </div>
      }

              
    </div>
      )
}

export default PopUp_addAgent
