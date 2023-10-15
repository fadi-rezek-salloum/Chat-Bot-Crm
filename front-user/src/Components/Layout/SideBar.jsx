import React, { useState ,useContext,useEffect} from 'react';
import { MdSpaceDashboard, MdPeople, MdExpandMore ,MdPayments} from 'react-icons/md';
import { TbSocial ,TbPointFilled} from 'react-icons/tb';
import { IoLogoWhatsapp , IoMdSettings} from 'react-icons/io';
import { FaHouseChimneyUser} from 'react-icons/fa6';
import { CgMathPercent} from 'react-icons/cg';



import { BiLogoFacebook , BiLogoInstagramAlt ,BiLogoTelegram , BiLogoTwitter} from 'react-icons/bi';
import { Link,useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";




import oval from '../../Assets/ActiveStateMark.svg'
import logo_color from '../../Assets/logo_color.svg'
import { useStateContext } from "../../contexts/MessgeContext";

const Sidebar = () => {
  const location = useLocation();

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

  // useEffect( ()=>{
  //   if(!isPayment){
  //     setActiveItem("Plans")
  //   }


 
  // },[])


  const { socialMedia, setSocialMedia ,isPayment, user} = useContext(AuthContext)

  const [activeItem, setActiveItem] = useState(
    'Dashboard'
    );
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
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

        { title: 'Settings', icon: <IoMdSettings /> ,  link:'settings'},
    
      ];
    
  }else{
   
    sidebarItems = [
      { title: 'Dashboard', icon: <MdSpaceDashboard /> ,  link:'dashboard'},
      { title: 'Social Media', icon: <TbSocial />,
  
       subItems: 
       
       [
       {title: 'WhatsApp', icon: <IoLogoWhatsapp /> ,  link:'link-whatsapp' , 
       isRead:socialMedia.find((item) => item.social_media === "whatsApp" && item.unread_conversations)?true:false },
       {title: 'Facebook', icon: <BiLogoFacebook /> ,  link:'link-facebook' , 
       isRead:socialMedia.find((item) => item.social_media === "facebook" && item.unread_conversations)?true:false},
       {title: 'Instagram', icon: <BiLogoInstagramAlt /> ,  link:'link-instagram', 
       isRead:socialMedia.find((item) => item.social_media === "instagram" && item.unread_conversations)?true:false}, 
       {title: 'Telegram', icon: <BiLogoTelegram /> ,  link:'link-telegram', 
       isRead:socialMedia.find((item) => item.social_media === "telegram" && item.unread_conversations)?true:false}, 
      ] },
  
  
      { title: 'Agents', icon: <MdPeople /> ,  link:'agents'},
      { title: 'Departments', icon: <FaHouseChimneyUser />,  link:'departments' },
      { title: 'Payment', icon: <MdPayments />,  link:'payment' },
      { title: 'Plans', icon: <CgMathPercent />,  link:'plans' },
  
      
      { title: 'Settings', icon: <IoMdSettings /> ,  link:'settings'},
  
    ];
     
  }

  

  const handleItemClick = (title) => {


    // const updatedSocialMediaContent = socialMedia.map((item) => {
    //   if (item.social_media === title) {
    //     // If the social media name matches, update the unread_conversations value
    //     return { ...item, unread_conversations: false };
    //   }
    //   // Otherwise, keep the item unchanged
    //   return item;
    // });

    // setSocialMedia(updatedSocialMediaContent)

    if(isPayment){
      setActiveItem(title);
  
      if (title === 'Social Media') {
        setSocialMediaOpen(!socialMediaOpen);
      }
    }
    
  };
  console.log(socialMedia)

  // {socialMedia.find((item) => 
  //   item.social_media === subItem.title.toLowerCase  
  //   && true) && (
  //           <div className='text-red-700 w-[10%]'><TbPointFilled/></div>
  //     )
      
  //     }
  return (
    <div className=" bg-background w-full h-screen flex flex-col  ">
       <Link  to="/">
      <div className="flex justify-center items-center text-xl  py-4  mx-auto"
                

      >
        <img src={logo_color} className='mt-4' alt='' />
        <p className=' text-2xl text-primary'><span className=' font-bold'>CRM</span>chatbot</p>

      </div>
      </Link>
      {sidebarItems.map((item) => (
        
        <React.Fragment key={item.title}>
          <Link  to={isPayment ? item.link : null}  >
          <div
            onClick={() => handleItemClick(item.title)}
            className={`flex items-center  gap-6 py-4 px-10 w-[100%] mx-auto
             cursor-pointer relative ${
              activeItem === item.title ? ' text-secondary' : 'text-primary'

            }`}
          >
             
            <div className="text-[18px]">{item.icon}</div>
            <div className='text-[18px]'>{item.title}</div>
            {
              activeItem === item.title ?
              <div className=' absolute left-0 '>
                            <img src={oval} alt='' />
                          </div> :<div></div>
                          
                          
                          }
            {item.subItems && (
              <div
                className={`ml-auto transform ${
                  socialMediaOpen ? 'rotate-180' : ''
                } transition-transform duration-300`}
              >
                <MdExpandMore />
              </div>
            )}
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
                          activeItem === subItem.title ? ' text-secondary' : 'text-primary'

                        }`}
                      >
                        <div className=" w-[10%] ">{subItem.icon}</div>
                        <div className=' text-base  w-[80%]'>{subItem.title}</div>
                  
                          <div className={`absolute left-0 ${ activeItem === subItem.title ? 'visible' : 'invisible'}`}>
                          <img src={oval} alt=''/>
                          </div> 
                          {subItem.isRead && (
                                  <div className='text-red-700 w-[10%]'><TbPointFilled/></div>
                            )
                            
                            }     
                          
                          
                    </div>
                    </Link>
                </React.Fragment>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;






