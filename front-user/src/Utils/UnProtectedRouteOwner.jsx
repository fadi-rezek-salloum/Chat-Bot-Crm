import { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom'

import AuthContext from '../contexts/AuthContext';

export default function PrivateRoutePayment(){
 
    let { user} = useContext(AuthContext);

    return (
        (user.role !== "owner") ?   <Outlet/> : <Navigate to="/" />
    )
   
}
