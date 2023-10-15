import { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom'

import AuthContext from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function UnProtectedRouteSocialMedia({userRole}) {
  const {socialMediaAuth , user } = useContext(AuthContext)

  
  const location = useLocation();
  const link = location.state && location.state.link;

  const current_url = location.pathname;
  const to_link = `${current_url.substring(6,current_url.length )}`;

  let current_socialMediaAuth  = null;
  if (current_url === '/link-telegram') {
    current_socialMediaAuth = socialMediaAuth.telegram
  } else if (current_url === '/link-facebook') {
    current_socialMediaAuth = socialMediaAuth.facebook
  } else if (current_url === '/link-instagram') {
    current_socialMediaAuth = socialMediaAuth.instagram
  }  else if (current_url === '/link-whatsapp') {
  
    console.log(socialMediaAuth.whatsapp)
    current_socialMediaAuth = socialMediaAuth.whatsapp
  } 


   
    return (
        <div>

        {((current_socialMediaAuth  || userRole ==="agent") && link!=="true") ? (
            
             <Navigate to={to_link} />   
          ) : (
            <Outlet/>
          )}
        
        </div>
    )
}

