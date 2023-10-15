import React , {useContext , useState , useEffect}  from 'react'
import {IoMdClose} from "react-icons/io"
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import Loader from '../Loader';
import { useStateContext } from "../../contexts/ContextProvider";

import {BsFillPersonFill , BsFillTelephoneFill , BsChevronDown} from 'react-icons/bs'

const PopUp_Redirect = (props) => {

    let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
    let url_GET_DEPARTEMENT=process.env.REACT_APP_DEPARTMENTS_URL
    let url_redirect=`${baseUrl}route-conversation`

  const {authTokens} = useContext(AuthContext)
    const [loading,setLoading]=useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState({});
    const {departments, setDepartments } = useStateContext()
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
      };
      
  useEffect(() => {
 
    
        getDepartement();

    
  }, []);

  const getDepartement = async () => {
    try {
    
      const response = await axios.get(url_GET_DEPARTEMENT, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
    
      console.log(response.data.departments)
    
      if (response.status === 200) {
        // Sign-up successful

        // setDepartments(
        //   response.data.departments
        
        //     .map(item => ({ value: item.id, label: item.department_name }))
        // );
        console.log(props.conversation.deparetment)
        const newDepartments = response.data.departments
        .filter(item => !props.conversation.deparetment.some(item2 => item2 === item.id))
        .map(item => ({ value: item.id, label: item.department_name }));

        setDepartments(
          newDepartments
        );
    
        // Redirect or show success message
      }
    } catch (error) {
    
        console.log(error)
    
    
    
      
    }
    // setIsLoading(false); // Stop loading indicator
    
    }


    const Redirect_User = async () => {
        setLoading(true);
          try {
      
       
      
            const response = await axios.post(`${url_redirect}/${props.conversation.id}/${parseInt(selectedOption.value)}`, 
            {
            
           
      
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
            
             
              props.setTypePopup(
                {
                  type:"succussfuly",
                  text:"Redirected to department successfully!"
              })
            }
          } catch (error) {
          
      
            console.log(error)
            if(!selectedOption.value){
              props.setTypePopup(
                {
                  type:"error",
                  text:"Please select a department. "
              })
            }else{
              props.setTypePopup(
                {
                  type:"error",
                  text:"Redirection failed. Please try again."
              })
            }
             
            
          }
          setLoading(false); // Stop loading indicator
      
        }



  return (
    <div className=" relative  flex justify-center flex-col items-center animate-slideup bg-white dark:bg-[#1C1817] md:w-[40%]  sm:w-[60%] w-[80%] h-[33%] rounded-2xl z-[10]   ">
    <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
      <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />


    </div>

    <div className='  justify-center items-center flex flex-col w-full gap-6' >
  
        <p className="text-primary text-lg  ">
        Choose a department</p>

        <div className={`border  py-2.5 px-5
              flex  justify-start items-center rounded-3xl               
              `}
              
              >
            
              <BsFillPersonFill className='w-[20px] h-[20px] text-gray_color' />
              
                 {/* Replace the input with a dropdown */}
                <div className='relative w-full '
                  onClick={() => setIsOpen(!isOpen)}
                >
                
                <input className='focus:outline-none px-2 py-0.5 w-full   text-black cursor-pointer'
                     type='text'
                     name="departement"    
                     value={selectedOption.label}
                      // onChange={handleChange}
                    readOnly
                    placeholder= 'Select a Department'

              />

                {isOpen && (
                  <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full h-[250px] py-2 rounded-md shadow-md overflow-y-auto">
                    {departments.map((option) => (
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




        {loading ? <div className="  flex items-center justify-center  w-full mt-8 text-gradient-to-r from-[#EC3131] via-[#970505] to-[#852f2f]"> <Loader /> </div>    :

        <div className=' w-full flex flex-row gap-6 justify-center items-center' >
       

        <div className=' flex justify-center items-center w-[50%] gap-6 ' >
                <button 
                onClick={()=>{
                    Redirect_User()
                
                }} 
                className=' text-white 
                 w-full
                 bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
                    py-4
                  rounded-3xl
                    flex items-center justify-center ' 
                    
                    >
                   Send
                </button>


                
          
                
               
               

         </div>
    </div>
 }
    
   

    </div>
</div>
  )
}

export default PopUp_Redirect