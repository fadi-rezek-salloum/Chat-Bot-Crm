import React,{useContext , useState} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useStateContext} from "../contexts/ContextProvider";

import TopBar from '../components/Layout/TopBar';
import Owner from '../components/Owner/Owner';
import Settings from '../components/Settings/Settings';

const PlansPage = () => {
    const {authTokens} = useContext(AuthContext)

  return (
    <div className='w-full h-full flex flex-col'>
          { authTokens && <TopBar
          title = "Settings"
          description = "Manage your personal account"
          isSearch = {false}
          /> }
      <Settings 
    
      />
    
   </div>
  )
}

export default PlansPage