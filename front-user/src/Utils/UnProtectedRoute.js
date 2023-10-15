import { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext';


export default function UnProtectedRoute(){
 
    let {authTokens , setHere } = useContext(AuthContext);
    
    return (
        
        authTokens!==null  ?   <Navigate to="/dashboard"/>   : <Outlet/>
    )
   
}
