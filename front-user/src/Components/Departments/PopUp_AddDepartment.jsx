import React , {useState} from 'react'
import {IoMdClose} from "react-icons/io"
import {MdEmail} from 'react-icons/md'
import {IoMdAdd} from 'react-icons/io'

import {HiOutlineSortDescending} from 'react-icons/hi'
import { FaHouseChimneyUser} from 'react-icons/fa6';

import axios from 'axios';
import Loader from '../Loader'
import { useStateContext } from "../../contexts/ContextProvider";

const PopUp_AddDepartment = (props) => {

    let baseUrl=process.env.REACT_APP_DEPARTMENTS_URL
    let url_ADD_DEPARTEMENT=`${baseUrl}`
    const accessToken =localStorage.getItem('accessToken'); 

    const [formValues, setFormValues] = useState(
      props.typePopup.type==="edit"
      ? props.departmentSelect
      : {}
      );
    const [loading,setLoading]=useState(false)

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };
    const Add_departement = async () => {
      setLoading(true);
        try {  
          const response = await axios.post(url_ADD_DEPARTEMENT, 
          {
            "department_name":  formValues.department_name,
            "description":  formValues.description

          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
          );
        //   props.setShowPopup(false)
       

          if (response.status === 201) {
            const res = [...props.departments,
              { id:response.data.department.id ,
               agents_count : 0,
               department_name:response.data.department.department_name ,
               description:response.data.department.description ,

             
             }]
            props.setDepartments(res);
            props.setDepartmentsorignal(res)
           
            
            props.setTypePopup(
              {
                type:"succussfuly",
                text:"The department was added succussfuly"
              })
           

            }
        } catch (error) {
        
            console.log(error)
            if(error.response.data.message === "Department already exists"){

              setFormErrors({department_name:error.response.data.message})
            }else{
              props.setTypePopup(
                {
                  type:"error",
                  text:"An error accured while adding The department"
                })
            }
    
       
          
        }
        setLoading(false); 
    
      }
    const update_departement = async () => {
        try {
            setLoading(true)
         
      
    
          const response = await axios.put(`${baseUrl}${props.departmentSelect.id}`, 
          {
            "department_name":  formValues.department_name,
            "description":  formValues.description
            
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
          );
        //   props.setShowPopup(false)

          props.setTypePopup(
            {
              type:"succussfuly",
              text:"Changes were saved succussfully"
          })

          if (response.status === 200) {
            // Sign-up successful
          
            const updatedDep = props.departments.map((department) => {
              if (department.id === props.departmentSelect.id) {
                return { ...department,
                  "department_name":  formValues.department_name,
                  "description":  formValues.description
                };
              }
              return department;
            });
        
            props.setDepartments(updatedDep);
            props.setDepartmentsorignal(updatedDep)

          
            // Redirect or show success message
          }
        } catch (error) {
        
            console.log(error)
            if(error.response.data.message === "Department already exists"){

              setFormErrors({name:error.response.data.message})
            }else{
              props.setTypePopup(
                {
                  type:"error",
                  text:"An error accured while updating The department"
                })
            }
    
          
          
        }
        setLoading(false); // Stop loading indicator
         
      }
      const handleSubmit = (e) => {
        e.preventDefault();
       
      
        const errors = validate(formValues);
    
        setFormErrors(errors);
    
      
        // If there are no form errors, proceed with API call
        if (Object.keys(errors).length === 0 ) {
          if(props.typePopup.type==="edit"){
            update_departement()
          }else{
            Add_departement()
          }
        
        }
      };
      const validate = (values) => {
        const errors = {};
        if (!values.department_name) {
          errors.department_name = "Enter your Department name";
        }
        
        if (!values.description) {
          errors.description = "Enter your description";
        }
      


        const isExist = props.departments.some((dept) => dept.department_name === values.department_name);

        if(isExist){

          errors.department_name = "Department already exists"
        }
    
        
        return errors;
      };
    return (
        <div className=" relative font-inter  flex justify-center py-12 px-4
         flex-col items-center animate-slideup bg-white dark:bg-[#1C1817]  md:w-[70%] w-[70%] h-max rounded-2xl z-[10]   ">
            <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
            <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />
        
        
            </div>
    
        <div className='  justify-center items-center flex flex-col w-full gap-6 ' >
           
     
            <div className='w-[90%]'>
        <div className={`border  py-3 px-5   w-full
              flex  justify-start items-center rounded-3xl        
              ${formErrors.department_name ? 'border-red-500' : ' border-bg-gray_color'}
 
              `}>
            
              <FaHouseChimneyUser className='w-[20px] h-[20px] text-gray_color' />
              
              <input className='focus:outline-none px-2 py-0.5 w-full  '
                     type='text'
                     name="department_name"    
                     value={formValues.department_name}
                     onChange={handleChange}
                 
              placeholder="Department name"/>
            
            </div>
            <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.department_name}</p>

            </div>
            <div className='w-[90%] '>
            <div className={`border  py-3 px-5
              flex  justify-start items-start rounded-3xl   w-full       
              ${formErrors.description ? 'border-red-500' : ' border-bg-gray_color'}
  
              `}>
            
              <HiOutlineSortDescending className='w-[20px] h-[20px] mt-1  text-gray_color' />
              
             
                <textarea
                    className='focus:outline-none px-2 py-1 w-full'
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                 
                    rows={4}
                    placeholder="Description"
                ></textarea>
            
            </div>
            <p className=' text-[10px] text-red-500 mx-6 '>{formErrors.description}</p>

            </div>
          
    
        
       
    
        </div>
        {loading ? <div className="mt-8"> <Loader /> </div>    :   <div className='flex shadow-lg text-white  w-max     mt-8
                shadow-primary-500/50     px-10 py-3.5 
                bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

            rounded-3xl    items-center justify-center gap-1 cursor-pointer'
            onClick={handleSubmit} 

            >
                <IoMdAdd/>
                {
                   props.typePopup.type==="edit"
                   ? "Update department"
                   : " Add new department"
                 }
               

                
            </div> }
      
    </div>
      )
}

export default PopUp_AddDepartment