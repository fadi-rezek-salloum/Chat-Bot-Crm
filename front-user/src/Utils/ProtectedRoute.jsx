import { useContext , useEffect} from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom'

import AuthContext from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles   , userRole , isPayment }){
    const location = useLocation();

    const login = location.state && location.state.login;

    const current_url = location.pathname;
    let link = "";
    if(current_url.length>7){
         link = `${current_url.substring(6,current_url.length )}`;

    }
 


     let {authTokens  , getUser , user} = useContext(AuthContext);
    if(login==="true"){
        getUser()
    }   

    if(authTokens === null){
        return (    
            <Navigate to="/" />  
        )
    }else if((allowedRoles.includes(userRole) && isPayment)  || login==="true"){
        return (    
            <Outlet/>  
        )
    }else if(!isPayment && allowedRoles.includes(userRole) ){
        return (    
            <Navigate to="/plans" />  
        )
    }else if(userRole ==="owner" ){
        return (    
            <Navigate to="/dashboard" />  
        )
    }else{
        
        
            if(link==="facebook" ||link==="telegram" ||link==="instagram" ||link==="whatsapp" ){
                return (  <Navigate to={link} />  ) 
            }else{
                return (   <Navigate to="/settings" />  ) 
            }
           
        
    }


    
   
    //  if ((authTokens!== null  && allowedRoles.includes(userRole) && isPayment) 
    //  || login==="true"  ) {
   
    //     return (    
    //         <Outlet/>  
    //     )
    // }else if(authTokens=== null){
    //     return (    
    //         <Navigate to="/" />  
    //     )
       
    // }else if(!isPayment && allowedRoles.includes(userRole) ){
    //     return (    
    //         <Navigate to="/plans" />  
    //     )
    // }else if(userRole ==="owner" ){
    //     return (    
    //         <Navigate to="/dashboard" />  
    //     )
    // }else{
        
        
    //         if(link==="facebook" ||link==="telegram" ||link==="instagram" ||link==="whatsapp" ){
    //             return (  <Navigate to={link} />  ) 
    //         }else{
    //             return (   <Navigate to="/settings" />  ) 
    //         }
           
        
    // }

    
    
   
   
}

