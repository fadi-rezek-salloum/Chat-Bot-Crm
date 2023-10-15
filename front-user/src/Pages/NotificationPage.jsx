import React,{useContext , useState , useEffect} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useStateContext} from "../contexts/ContextProvider";


import TopBar from '../Components/Layout/TopBar';
import Notification from '../Components/Notification/Notification';


const NotificationPage = () => {
    const {authTokens} = useContext(AuthContext)

  return (
    <div className='w-full h-full flex flex-col'>
    { authTokens && <TopBar
    title = "Notification"
    description = ""
    isSearch = {false}

    // className="z-10 "
    /> }
    <div  className="  mt-24 w-full h-full">
    <Notification />
    </div>


</div>
  )
}

export default NotificationPage