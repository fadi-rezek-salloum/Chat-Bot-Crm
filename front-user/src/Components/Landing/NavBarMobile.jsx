import React,{useState,useContext} from 'react'
import { NavLink } from 'react-router-dom'
import {HiMenuAlt4} from "react-icons/hi"
import {AiOutlineClose} from "react-icons/ai"
import { useStateContext } from '../../contexts/ContextProvider';
import { Link } from "react-scroll";
import AuthContext from '../../contexts/AuthContext';
import { useNavigate  } from "react-router-dom";

import { MdSpaceDashboard, MdPeople } from 'react-icons/md';
import { IoMdSettings} from 'react-icons/io';
import logo_chatbot_white from '../../Assets/logo_chatbot_white.svg'
import logo_chatbot from '../../Assets/logo_chatbot.svg'
import {BsFillPersonFill} from 'react-icons/bs'

export const ListItem=({icon,name,link,setToggle})=>{

    return(
    <li className={` w-full flex flex-row justify-center items-center gap-2 cursor-pointer my-2 text-white text-lg`}> 
          <NavLink onClick={()=>setToggle(false)} className=' hover:bg-[#EDE0DD] w-full flex flex-row gap-2 justify-start items-center' to={link} >
            {icon}  {name}</NavLink></li>
    )
  }


  

function NavbarMobile() {
  const {baseUrl,authTokens,logoutUser , user}=useContext(AuthContext)

  const [toggle,setToggle]=useState(false)
  const history = useNavigate();

  const {activeMenu} = useStateContext()
  const [activeItem, setActiveItem] = useState('Dashboard');
  const handleItemClick = (title) => {
    setActiveItem(title);
  
  };
    const sidebarItems = [
      { title: 'Home',   link:'Intro'},
      { title: 'Product', link:'Product'},
      { title: 'Features',  link:'Features' },
      { title: 'Why CRMchatbot',  link:'Why CRMchatbot' },

      { title: 'Plans',  link:'Plans'},
    ];
  return (
    <div className=" z-[20] bg-transparent justify-end flex w-full absolute  py-4  ">

    {toggle ? (
      ""
    ) : (
      <div className='w-full flex justify-between items-center px-4'>
      <img src={logo_chatbot} alt='' />


      <HiMenuAlt4
            fontSize={28}
              className="   cursor-pointer "
              onClick={()=>setToggle(true)}
            />
      </div>
     
    )}



    { toggle && 
    <div className=" overflow-scroll bg-primary z-[1000] fixed top-0 -right-2 p-3   ss:w-[40vw] xs:w-[60vw] h-screen shadow-2xl md:hidden list-none
    flex flex-col  items-center rounded-md text-white animate-slideright " >
      <div className=" flex justify-between items-center text-xl w-full  " >
          <AiOutlineClose className=' cursor-pointer'  onClick={()=>setToggle(false)} />
          <img src={logo_chatbot_white}  className='mt-4' alt='' />

        </div>
        
        <div className='flex flex-col h-full  justify-between'>
        <div className="  flex flex-col justify-center items-center mt-4 h-[80%] ">
          {sidebarItems.map((item) => (
        
          <Link  to={item.link} spy={true} smooth={true} >
          <div
            onClick={() => setToggle(false)}
            className={` w-full flex items-center  gap-6 py-4 px-10  mx-auto
             cursor-pointer relative `}
          >
             
            <div className='text-[18px]'>{item.title}</div>
         
           
          </div>
          </Link>
        
  
      ))}
            {!authTokens ? 
            <div className='flex flex-col mt-7 gap-4 justify-between items-center '>
            <button className='  text-white  px-6 py-1.5  rounded-[40px] '
             onClick={()=>{
              history('/login')
              setToggle(false)
            }}
            >
        Login
                
            </button>
            <button className='w-max bg-white text-primary px-6 py-1.5  rounded-[40px] '
              onClick={()=>{
                history('/signUp')
                setToggle(false)
              }}
            
            >
          Sign Up
        
               
              
            </button>
            </div> : 

       
          <div className='flex  
                bg-white cursor-pointer

            rounded-3xl w-max px-6 py-2 mt-7 text-primary items-center justify-center gap-1'
              onClick={()=>{
                history('/dashboard')
                setToggle(false)
              }}
            >
                <BsFillPersonFill/>
                {user?.username}
            </div>
          }
          </div>
         
        </div>

      

          
          
     
        </div>

    }
  </div>
  )
}

export default NavbarMobile