import React, { useContext,useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useStateContext } from "../../contexts/ContextProvider";


import { MdSpaceDashboard, MdPeople } from 'react-icons/md';
import {  IoMdSettings} from 'react-icons/io';
import { CgMathPercent} from 'react-icons/cg';


import oval from '../../assets/oval.svg'
import logo from '../../assets/logo_chatbot.svg'
const Sidebar = () => {
  const {logoutUser} = useContext(AuthContext)
  const {activeMenu} = useStateContext()
  const [activeItem, setActiveItem] = useState('Dashboard');
  const location = useLocation();

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
  const sidebarItems = [
    { title: 'Dashboard', icon: <MdSpaceDashboard /> ,  link:'admin/dashboard'},
    { title: 'Owner', icon: <MdPeople /> ,  link:'admin/owner'},
    { title: 'Plans', icon: <CgMathPercent />,  link:'admin/plans' },
    { title: 'Settings', icon: <IoMdSettings /> ,  link:'admin/settings'},
  ];

  const handleItemClick = (title) => {
    setActiveItem(title);
  
  };



  return (
    <div className={`bg-background h-screen overflow-auto`}>
      {activeMenu && (
        <>
           <div className="  w-full h-screen flex flex-col  ">
      <div className="flex justify-center items-center text-xl  py-4   mx-auto">
        <img src={logo} className='mt-4  mr-4' alt='' />
        
      </div>
      
      {sidebarItems.map((item) => (
        
        <React.Fragment key={item.title}>
          <Link  to={item.link}>
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
           
          </div>
          </Link>
        
        </React.Fragment>
      ))}
    </div>
          
        
        </>
      )}
    </div>
  );
};

export default Sidebar;
