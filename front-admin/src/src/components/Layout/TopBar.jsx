import React,{useContext , useState , useEffect} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import {IoIosNotifications , IoIosArrowDown } from 'react-icons/io'

import {IoLogOut  } from 'react-icons/io5'

import icon from '../../assets/icon.svg'
import AuthContext from "../../contexts/AuthContext";
import logo_color from '../../assets/logo_color.svg'
import Notification from '../Notification/Notification'

const TopBar = ({title , description , list ,setFiltered ,placeholderShearch ,isSearch} ) => {
   const {logoutUser , activeMenu , user , notificationCount } = useContext(AuthContext)

   const [showLogout, setShowLogout] = useState(false);


   const [searchTerm, setSearchTerm] = useState('');


   const {authTokens , notifications , setShowNotifications , showNotifications} = useContext(AuthContext)

 



   const handleNameClick = () => {
     // Toggle the visibility of the logout button
     setShowLogout(!showLogout);
   };

   const handleSearch = (e) => {
    // Filter payments based on the operation_ID
    console.log(e.target.value)
    console.log(list)
    let filtered ;
    if(title === "Owners"){
       filtered = list.filter(item =>
        item.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFiltered(filtered);
    }else if(title === "Payment"){
      filtered = list.filter(item =>
       item.payment.transaction_id.toLowerCase().includes(e.target.value.toLowerCase())
     );
     setFiltered(filtered);

   }
  
   

  };
 


  return (
    <div className={` 
     flex py-6 px-10 items-center gap-10 justify-between font-inter 
     
     `}>
          <div className="xs:hidden flex justify-center items-center text-xl    mx-auto ">
            <img src={logo_color} className='mt-4' alt='' />
            <p className=' text-2xl '><span className=' font-bold'>CRM</span>chatbot</p>

        </div>
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
        
       


         <div className=' md:flex  text-white h-max px-3 py-1.5   shadow-lg
            shadow-primary-500/50 
            bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
           rounded-3xl hidden cursor-pointer'
           onClick={() => setShowNotifications(!showNotifications)}
           >
            <IoIosNotifications className='w-[25px] h-[25px] '/>
            <p className=''>
             
            {notificationCount}
              </p>
         </div>
         <div className='md:flex hidden'>
            <img src={icon} alt='' className='w-[25px] h-[25px] '/>
         </div>
         <div className='md:flex  hidden items-center justify-center
          text-primary gap-2 cursor-pointer'
          onClick={handleNameClick}
          >
            
            <p className=' font-inter font-medium '  
            
            // onClick={()=>logoutUser()}
           
            >Admin</p>
            <IoIosArrowDown className=''/>
            
         </div>

         </div>

   
         {showLogout && (
          <div className='absolute bg-white shadow p-2 rounded-lg right-0 mx-10 top-0 mt-20'>
            <div className='text-primary cursor-pointer flex items-center justify-center px-4 gap-1' 
           onClick={()=>logoutUser()}>
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