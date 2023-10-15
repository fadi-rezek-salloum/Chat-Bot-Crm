import React,{useEffect,useState,useContext} from 'react'
import { NavLink } from 'react-router-dom'
import {HiMenuAlt4} from "react-icons/hi"
import {AiOutlineClose} from "react-icons/ai"
import { useStateContext } from '../../contexts/MessgeContext';
import { Link,useNavigate,useLocation  } from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import icon from '../../Assets/icon.svg'

import logo_white from '../../Assets/logo_chatbot_white.svg' 
import logo from '../../Assets/logoaa.svg'


import {  MdSpaceDashboard, MdPeople , MdExpandMore ,MdPayments} from 'react-icons/md';
import { TbSocial ,TbPointFilled} from 'react-icons/tb';
import { IoLogoWhatsapp , IoMdSettings , IoIosNotifications} from 'react-icons/io';
import { FaHouseChimneyUser} from 'react-icons/fa6';
import { CgMathPercent} from 'react-icons/cg';


import { BiLogoFacebook , BiLogoInstagramAlt ,BiLogoTelegram , BiLogoTwitter} from 'react-icons/bi';


export const ListItem=({icon,name,link,setToggle})=>{

    return(
    <li className={` w-full flex flex-row justify-center items-center gap-2 cursor-pointer my-2 text-white text-lg`}> 
          <NavLink onClick={()=>setToggle(false)} className=' hover:bg-[#EDE0DD] w-full flex flex-row gap-2 justify-start items-center' to={link} >
            {icon}  {name}</NavLink></li>
    )
  }


  

function NavbarMobile() {
  const location = useLocation();
  const {logoutUser,user , socialMedia , isPayment}=useContext(AuthContext)

  const [toggle,setToggle]=useState(false)
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
  const { setNotifications}=useStateContext()
  const history = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard');

  let currentPathname  = null ; 

  useEffect(() => {
    // Extract the pathname from the location object
    try {


    currentPathname = location.pathname.substring(1,location.pathname.length);
 
    if(currentPathname!==null){
      if (
        currentPathname === 'link-whatsapp' ||
        currentPathname === 'link-facebook' ||
        currentPathname === 'link-instagram' ||
        currentPathname === 'link-telegram' ||
        currentPathname === 'whatsapp' ||
        currentPathname === 'facebook' ||
        currentPathname === 'instagram' ||
        currentPathname === 'telegram'  
      ) {
        if(currentPathname.length<10){
          currentPathname = "link-"+currentPathname;
        }
  
  
        
        setSocialMediaOpen(true);
        const sidebarItem = sidebarItems[1].subItems.find((item) =>
        currentPathname.includes(item.link));
   
      if(sidebarItem!==undefined ){
        setActiveItem(sidebarItem.title);
  
      }
      
        
      }else {
        
        const sidebarItem = sidebarItems.find((item) =>
        currentPathname.includes(item.link));
        console.log(sidebarItems)

        console.log(sidebarItem)
        if(sidebarItem!==undefined ){
          setActiveItem(sidebarItem.title);
  
        }
      
      }
   
    }
   }catch(e){

    }
 

    // if(!isPayment){
    
    //   setActiveItem("Plans")
    // }

  }, [currentPathname]);






  const handleItemClick = (title) => {


    if(isPayment){
      setActiveItem(title);
      if (title === 'Social Media') {
        setSocialMediaOpen(!socialMediaOpen);
      }else{
        setToggle(false)
      }
    }
  
  };
    let  sidebarItems =[{}];

  if(user?.role==="agent"){
    sidebarItems = [
        { title: 'Social Media', icon: <TbSocial />,
    
         subItems: 
         
         [
         {title: 'WhatsApp', icon: <IoLogoWhatsapp /> ,  link:'whatsapp' , 
         isRead:socialMedia.find((item) => item.social_media === "whatsApp" && item.unread_conversations) },
         {title: 'Facebook', icon: <BiLogoFacebook /> ,  link:'facebook' , 
         isRead:socialMedia.find((item) => item.social_media === "facebook" && item.unread_conversations)},
         {title: 'Instagram', icon: <BiLogoInstagramAlt /> ,  link:'instagram', 
         isRead:socialMedia.find((item) => item.social_media === "instagram" && item.unread_conversations)}, 
         {title: 'Telegram', icon: <BiLogoTelegram /> ,  link:'telegram', 
         isRead:socialMedia.find((item) => item.social_media === "telegram" && item.unread_conversations)}, 
        ] },
        { title: 'Notification', icon: <IoIosNotifications /> ,  link:'notification'},

        { title: 'Settings', icon: <IoMdSettings /> ,  link:'settings'},
    
      ];
    
  }else{
   
    sidebarItems = [
      { title: 'Dashboard', icon: <MdSpaceDashboard /> ,  link:'dashboard'},
      { title: 'Social Media', icon: <TbSocial />,
  
       subItems: 
       
       [
       {title: 'WhatsApp', icon: <IoLogoWhatsapp /> ,  link:'link-whatsapp' , 
       isRead:socialMedia.find((item) => item.social_media === "whatsApp" && item.unread_conversations) },
       {title: 'Facebook', icon: <BiLogoFacebook /> ,  link:'link-facebook' , 
       isRead:socialMedia.find((item) => item.social_media === "facebook" && item.unread_conversations)},
       {title: 'Instagram', icon: <BiLogoInstagramAlt /> ,  link:'link-instagram', 
       isRead:socialMedia.find((item) => item.social_media === "instagram" && item.unread_conversations)}, 
       {title: 'Telegram', icon: <BiLogoTelegram /> ,  link:'link-telegram', 
       isRead:socialMedia.find((item) => item.social_media === "telegram" && item.unread_conversations)}, 
      ] },
  
  
      { title: 'Agents', icon: <CgMathPercent /> ,  link:'agents'},
      { title: 'Departments', icon: <FaHouseChimneyUser />,  link:'departments' },
      { title: 'Payment', icon: <MdPayments />,  link:'payment' },
      { title: 'Plans', icon: <MdPeople />,  link:'plans' },
  
      { title: 'Notification', icon: <IoIosNotifications /> ,  link:'notification'},

      { title: 'Settings', icon: <IoMdSettings /> ,  link:'settings'},

  
    ];
     
  }
  
  return (
    <div className=" z-[20] bg-transparent justify-end flex w-full absolute  ">

    {toggle ? (
      ""
    ) : (
      <div className='flex justify-between 
        items-center 
        sm:justify-end sm:py-10  sm:shadow-[0px] sm:bg-opacity-0
         w-full bg-white shadow-md'>
           
             <img src={logo} alt='' className='sm:hidden  mt-4 cursor-pointer'
             onClick={()=>{
          
              history('/')
             }}
        />
       
        <HiMenuAlt4
              fontSize={28}
                className="  md:hidden cursor-pointer mr-10  "
                onClick={()=>setToggle(true)}
              />
      </div>
    
    )}



    { toggle && 
    <div className=" overflow-scroll bg-primary z-[700] fixed top-0 -right-2 px-3 py-2   ss:w-[40vw] xs:w-[60vw] h-screen shadow-2xl md:hidden list-none
    flex flex-col  items-center rounded-md text-white animate-slideright" >
      <div className=" flex justify-between items-center text-xl w-full my-2 cursor-pointer" >
          <AiOutlineClose   onClick={()=>setToggle(false)} />
          <img src={logo_white} className='mt-2 cursor-pointer' alt=''
           onClick={()=>{
            setToggle(false)
            history('/')
           }}
          
          />
        </div>
       
        <div className="flex justify-center items-center text-xl  py-2 gap-3 mx-auto">
         <img src={icon} alt='' className='w-[25px] h-[25px] '/>

            <p className=' text-xl h-full  '>{user.username}</p>

        </div>

          <div className="  flex flex-col justify-center items-center mt-4 h-max">
          {sidebarItems.map((item) => (
        
        <React.Fragment key={item.title} >
          <Link  to={item.link} className=' w-full' >
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
          {socialMediaOpen && item.title === 'Social Media' && (
            <div className="">
              {item.subItems.map((subItem) => (
               
                <React.Fragment key={subItem}>
                   <Link  to={isPayment ? subItem.link : null} >
                    
                    <div
                        onClick={() => handleItemClick(subItem.title)}
                        className={`flex  items-center  justify-evenly   relative 
                         gap-4 py-3 pl-16 pr-6 w-[100%] mx-auto text-[18px]
                        cursor-pointer  ${
                          activeItem === subItem.title ? ' text-secondary' : 'text-white'

                        }`}
                      >
                        <div className=" w-[10%] ">{subItem.icon}</div>
                        <div className=' text-base  w-[80%]'>{subItem.title}</div>
                  
                          <div className={`absolute left-0 ${ activeItem === subItem.title ? 'visible' : 'invisible'}`}>
                         
                          </div> 
                          {/* {subItem.isRead && (
                                  <div className='text-red-700 w-[10%]'><TbPointFilled/></div>
                            )
                            
                            }      */}
                          
                          
                    </div>
                    </Link>
                </React.Fragment>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
            <button className='bg-white text-primary px-6 py-1.5  rounded-[40px] mt-8'
             onClick={()=>

              {
                setNotifications([])
                logoutUser()
              }
            }
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