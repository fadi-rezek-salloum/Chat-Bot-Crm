import React, { useState, useEffect  , useContext} from 'react';
import AuthContext from "../../contexts/AuthContext";
import {IoCheckmarkDoneCircleOutline  , IoCloseCircleOutline} from "react-icons/io5"
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'; 
import axios from 'axios';

const Notification = () => {
  let baseUrl=process.env.REACT_APP_NOTIFICATIONS_URL
 
  let url_read_Notification=`${baseUrl}`
  const {authTokens ,setNotificationCount , notificationCount , notifications , setOffset} = useContext(AuthContext)




 const read_Notification = async (notification) => {
  if(!notification.is_read){
    try {
            
      const response = await axios.post(`${url_read_Notification}read/${notification.id}`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
    
      if (response.status === 200) {
              
        setNotificationCount((prevnotificationCount) => prevnotificationCount-1);
      }
    
    } catch (error) {
    
        console.log(error)
    
    
    
      
    }
  }


            
}


const read_all_Notification = async () => {
  
  console.log(authTokens)
            try {
            
              const response = await axios.post(`${url_read_Notification}readAll`, 
             {},
              {
                headers: {
                  Authorization: `Bearer ${authTokens}`
                }
              }
              );
            
            
              if (response.status === 200) {
              
                setNotificationCount(0)
              }
            } catch (error) {
            
                console.log(error)
            
            
            
              
            }

            
}

const handleScroll = (e) => {
  e.preventDefault(); 
  e.stopPropagation(); 

  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  console.log(scrollTop+"//"+scrollHeight+"//"+clientHeight)

  if (scrollTop + clientHeight >= scrollHeight ) {
 
    setOffset((prevOffset) => prevOffset + 5);
  }
};

  return (
    <div className=' h-full pb-4 ' >
    <PerfectScrollbar className='h-10' onScroll={handleScroll}>

     <div className=' px-6 py-4 flex justify-between  text-xs text-primary font-normal'>
       <p className=' font-medium'>NOTIFICATIONS</p>
       <p  onClick={read_all_Notification} className=' cursor-pointer'>Mark all as read</p>
     </div>
    <div className="h-full px-6   overflow-y"> 

     <div className="space-y-4  ">
     {notifications.slice().map((notification) => (
       <div
         key={notification.id}
         className={`p-4 rounded-lg shadow-lg transition-transform transform  ${
           notification.is_read ? 'bg-gray-200' : 'bg-blue-100'
         } hover:scale-105 cursor-pointer` }
         onClick={()=>{read_Notification(notification)}}
       >
         <div className="flex items-center justify-between">
           <p className="text-base break-all w-[90%]">{notification.message}</p>
           {notification.is_read ? (
             <IoCheckmarkDoneCircleOutline size={24} className="text-green-500" />
           ) : (
             <IoCloseCircleOutline size={24} className="text-red-500" />
           )}
         </div>
         <p className="text-sm text-gray-500">
           {notification.created_at}
         </p>
       </div>
     ))}
   </div>
  

   </div>
   </PerfectScrollbar>
 </div>
  );
};


export default Notification;
