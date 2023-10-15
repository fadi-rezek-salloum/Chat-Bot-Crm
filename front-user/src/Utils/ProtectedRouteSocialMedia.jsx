import { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom'

import AuthContext from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function ProtectedRouteSocialMedia() {
    const {socialMediaAuth  , user} = useContext(AuthContext)

  const location = useLocation();
  const current_url = location.pathname;
  const to_link = `link-${current_url.substring(1,current_url.length )}`;
  
  let current_socialMediaAuth  = null;

  if (current_url === '/telegram') {
    current_socialMediaAuth = socialMediaAuth.telegram
  } else if (current_url === '/facebook') {
    current_socialMediaAuth = socialMediaAuth.facebook
  } else if (current_url === '/instagram') {
    current_socialMediaAuth = socialMediaAuth.instagram
  }  else if (current_url === '/whatsapp') {
    current_socialMediaAuth = socialMediaAuth.whatsapp
  } 

    return (
        <div>

        {current_socialMediaAuth || user.role ==="agent"  ? (
             <Outlet/>
          ) : (
            <Navigate to={to_link} />    
          )}
        
        </div>
    )
}

