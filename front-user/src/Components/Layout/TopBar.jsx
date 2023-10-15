import React,{useContext , useState , useEffect} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import {IoIosNotifications , IoIosArrowDown } from 'react-icons/io'

import {IoLogOut  } from 'react-icons/io5'

import icon from '../../Assets/icon.svg'
import AuthContext from "../../contexts/AuthContext";
import Notification from '../Notification/Notification'
import { useStateContext } from "../../contexts/MessgeContext";

const TopBar = ({title , description , list ,setFiltered ,placeholderShearch ,isSearch} ) => {
   const {logoutUser  , user , notificationCount , showNotifications, setShowNotifications } = useContext(AuthContext)

   const [showLogout, setShowLogout] = useState(false);
   const {setActiveMenu,activeMenu , setNotifications}=useStateContext()


  //  const [showNotifications, setShowNotifications] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');





   const handleNameClick = () => {
     // Toggle the visibility of the logout button
     setShowLogout(!showLogout);
   };

   const handleSearch = (e) => {
    // Filter payments based on the operation_ID
    console.log(e.target.value)
    console.log(list)
    let filtered ;
    if(title === "Agents"){
       filtered = list.filter(item =>
        item.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFiltered(filtered);
    }else if(title === "Departments"){
       filtered = list.filter(item =>
        item.department_name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFiltered(filtered);

    }else if(title === "Payment"){
      filtered = list.filter(item =>
       item.payment.transaction_id.toLowerCase().includes(e.target.value.toLowerCase())
     );
     setFiltered(filtered);

   }
    else if(title === "telegram"){
 
      const filtered = list.filter((item) =>
      {
        const name = `${item.sender_first_name} ${item.sender_last_name}`;
        return name.toLowerCase().includes(e.target.value.toLowerCase());
      }
      
      
      );
    
      setFiltered(filtered);

    }else {
 
      const filtered = list.filter((item) =>
      {
        
        return item.sender_username.toLowerCase().includes(e.target.value.toLowerCase());
      }
      
      
      );
    
      setFiltered(filtered);

    }
   

  };
 


  return (
    <div className={` 
     hidden py-6 px-10 items-center gap-10 justify-between font-inter 
     sm:flex
     `}>
         
         <div className={`ss:w-[30%] w-[70%]   ${  activeMenu ? "ml-72" :"" }
          text-primary xs:block hidden`}>
            <p className=' font-bold text-2xl'>{title}</p>  
            <p className='text-xs'>{description}</p> 
         </div> 
         <div className='flex md:justify-end justify-center  items-center gap-6 w-[70%] '>  
        {
          isSearch ?   <div className=' hidden border border-gray_color px-2 py-2  
          h-[42px]  rounded-3xl  md:flex justify-start items-center md:w-[50%] w-[70%]'>
            <AiOutlineSearch className='w-[20px] h-[20px] text-gray_color '/>
            <input className='focus:outline-none w-full text-sm  px-2 ' 
            placeholder={placeholderShearch}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              handleSearch(e);
            }}
            
            />
         </div> : <div></div>
        }
        
       
        {/* <div className=' md:flex  text-white h-max px-3 py-1.5   shadow-lg
            shadow-primary-500/50 
            bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
           rounded-3xl hidden cursor-pointer' */}

         <div className={`md:flex   h-max    shadow-lg py-[0.3rem]
              
            
           rounded-3xl hidden cursor-pointer
           ${!showNotifications ? 'shadow-primary-500/50  px-4 text-white bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47]  opacity-75'
            : 'border text-primary border-primary  px-5 '}
           
           `}
           onClick={() => setShowNotifications(!showNotifications)}
           >
            <IoIosNotifications className='w-[25px] h-[25px] '/>
             {
              !showNotifications ? <p className=''>
              {notificationCount}
              
              </p> : <p></p>

             }
            
         </div>
         <div className='md:flex hidden'>
            <img src={icon} alt='' className='w-[25px] h-[25px] '/>
         </div>
         <div className='md:flex  cursor-pointer hidden items-center justify-center text-primary gap-2'
          onClick={handleNameClick} 
         >
            <p className=' font-inter font-medium '  
            
            // onClick={()=>logoutUser()}
           
            >{user.username}</p>
            <IoIosArrowDown className=''/>
            
         </div>

         </div>

   
         {showLogout && (
          <div className='absolute bg-white shadow p-2  cursor-pointer rounded-lg right-0 mx-10 top-0 mt-20'
          onClick={()=>

            {
              setNotifications([])
              logoutUser()
            }
          }
          >
            <div className='text-primary flex items-center justify-center px-4 gap-1' 
          >
            <IoLogOut/>
              Logout
            </div>
          </div>
        )}

        {showNotifications && (
  <div className='absolute w-[30%] h-[80%] z-10 bg-white shadow  rounded-lg right-0 mr-40 top-0 mt-20'>
        <Notification  /> 
          
        </div>
      )}



    </div>
  )
}
export default TopBar