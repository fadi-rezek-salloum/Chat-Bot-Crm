import React,{useEffect,useState,useContext} from 'react'
import { NavLink } from 'react-router-dom'
import {HiMenuAlt4} from "react-icons/hi"
import {AiOutlineClose} from "react-icons/ai"
import { useStateContext } from '../../contexts/ContextProvider';
import { Link,useLocation } from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import icon from '../../assets/icon.svg'
import { CgMathPercent} from 'react-icons/cg';

import { MdSpaceDashboard, MdPeople } from 'react-icons/md';
import { IoMdSettings , IoIosNotifications} from 'react-icons/io';
import logo_white from '../../assets/logo_chatbot_white.svg'
export const ListItem=({icon,name,link,setToggle})=>{

    return(
    <li className={` w-full flex flex-row justify-center items-center gap-2 cursor-pointer my-2 text-white text-lg`}> 
          <NavLink onClick={()=>setToggle(false)} className=' hover:bg-[#EDE0DD] w-full flex flex-row gap-2 justify-start items-center' to={link} >
            {icon}  {name}</NavLink></li>
    )
  }


  

function NavbarMobile() {
  const location = useLocation();

  const {logoutUser}=useContext(AuthContext)

  const [toggle,setToggle]=useState(false)
    
  const {activeMenu} = useStateContext()
  const [activeItem, setActiveItem] = useState('Dashboard');

    let currentPathname  = null ; 

  useEffect(() => {
    // Extract the pathname from the location object
    currentPathname = location.pathname.substring(1,location.pathname.length);
 
    if(currentPathname!==null){

        
        const sidebarItem = sidebarItems.find((item) =>
        currentPathname.includes(item.link));
        console.log(sidebarItems)

        console.log(sidebarItem)
        if(sidebarItem!==undefined){
          setActiveItem(sidebarItem.title);
  
        }
      
      
    }
 

    // if(!isPayment){
    
    //   setActiveItem("Plans")
    // }

  }, [currentPathname]);
  const handleItemClick = (title) => {
    setActiveItem(title);
  
  };
    const sidebarItems = [
      { title: 'Dashboard', icon: <MdSpaceDashboard /> ,  link:'admin/dashboard'},
      { title: 'Owner', icon: <MdPeople /> ,  link:'admin/owner'},
      { title: 'Plans', icon: <CgMathPercent />,  link:'admin/plans' },
      { title: 'Settings', icon: <IoMdSettings /> ,  link:'admin/settings'},
      { title: 'Notifications', icon: <IoIosNotifications /> ,  link:'admin/notification'},

    ];
  return (
    <div className=" z-[20] bg-transparent justify-end flex w-full absolute  py-11 ">

    {toggle ? (
      ""
    ) : (

      <HiMenuAlt4
      fontSize={28}
        className="  md:hidden cursor-pointer mr-10 "
        onClick={()=>setToggle(true)}
      />
    )}



    { toggle && 
    <div className=" overflow-scroll bg-primary z-[700] fixed top-0 -right-2 px-3 py-2   ss:w-[40vw] xs:w-[60vw] h-screen shadow-2xl md:hidden list-none
    flex flex-col  items-center rounded-md text-white animate-slideright" >
      <div className=" flex justify-between items-center text-xl w-full my-2 cursor-pointer" >
          <AiOutlineClose   onClick={()=>setToggle(false)} />
          <img src={logo_white} className='mt-2' alt='' />
        </div>
       
        <div className="flex justify-center items-center text-xl  py-2 gap-3 mx-auto">
         <img src={icon} alt='' className='w-[25px] h-[25px] '/>

            <p className=' text-xl h-full  '>Admin</p>

        </div>

          <div className="  flex flex-col justify-center items-center mt-4 h-max">
          {sidebarItems.map((item) => (
        
        <React.Fragment key={item.title} >
          <Link  to={item.link} className=' w-full' onClick={()=>setToggle(false)}>
          <div
            onClick={() => handleItemClick(item.title)}
            className={` w-full flex items-center  gap-6 py-4 px-10  mx-auto
             cursor-pointer relative ${
              activeItem === item.title ? ' text-secondary' : 'text-white'
                
            }`}
          >
             
            <div className="text-[18px]">{item.icon}</div>
            <div className='text-[18px]'>{item.title}</div>
         
           
          </div>
          </Link>
        
        </React.Fragment>
      ))}
            <button className='bg-white text-primary px-6 py-1.5  cursor-pointer rounded-[40px] mt-8'
              onClick={()=>{logoutUser()}}
            >
                Logout
            </button>
          </div>
          
        
        </div>

    }
  </div>
  )
}

export default NavbarMobile