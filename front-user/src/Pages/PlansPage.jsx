import React,{useContext , useState} from 'react'
import TopBar from '../Components/Layout/TopBar'
import AuthContext from "../contexts/AuthContext";
import Plans from '../Components/Landing/Plans';
import axios from 'axios';


const PlansPage = () => {
    const {authTokens } = useContext(AuthContext)
  


    return (
    
  
        <div className='w-full h-full flex flex-col'>
            { authTokens && <TopBar
            title = "Plans"
            description = "Choose Plan That's Right For You"
            isSearch = {false}
         
            className="z-10"
            /> }
            <Plans  
              />


  
        </div>
          )
}

export default PlansPage