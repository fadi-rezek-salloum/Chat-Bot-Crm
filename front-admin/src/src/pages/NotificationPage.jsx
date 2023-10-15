import React,{useContext , useState , useEffect} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useStateContext} from "../contexts/ContextProvider";

import TopBar from '../components/Layout/TopBar';

import Notification from '../components/Notification/Notification';


const NotificationPage = () => {
    const {authTokens} = useContext(AuthContext)

  return (
    <div className='w-full h-full flex flex-col'>
    { authTokens && <TopBar
    title = ""
    description = ""
    isSearch = {false}

    // className="z-10 "
    /> }
    <div  className="  mt-5 w-full h-full">
    <Notification />
    </div>


</div>
  )
}

export default NotificationPage