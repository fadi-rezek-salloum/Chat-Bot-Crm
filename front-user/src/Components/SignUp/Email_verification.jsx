import React, { useEffect , useState } from 'react'

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Email_verification = () => {
  const history = useNavigate();
  const location = useLocation();
  let email = null;
  const isPasswordReset = location.state && location.state.isPasswordReset;
  const [timer, setTimer] = useState(60); // Initial timer value in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  let baseUrl = process.env.REACT_APP_USERS_URL;



  function maskEmail() {
    email = location.state && location.state.email;

    if(email !== null ){
      const parts = email.split('@');
      const username = parts[0];
      const domain = parts[1];
    
      const maskedUsername = username.slice(0, 3) + '*******'
      const maskedEmail = `${maskedUsername}@${domain}`;
      return maskedEmail;
    }else{
      history("/signUp")
    }

  
 
  }
  let url_ReSend ;

  const handleResendEmail = async () => {
    if(isPasswordReset){
       url_ReSend =`${baseUrl}request-password-reset?email=${email}`

    }else{
       url_ReSend = `${baseUrl}resend-verification-email?email=${email}`;

    }
    try {
      const response = await axios.post(url_ReSend);

      if (response.status === 200) {
        // Sign-up successful
        console.log('Email reSend');
        setIsResendDisabled(true); // Disable the resend button
        startTimer(); // Start the countdown timer
        // Redirect or show success message
      }
    } catch (error) {
      console.error('Error during sign-up:', error.response.data);
      // Handle error, show error message, etc.
    }
  };


  const startTimer = () => {
    let seconds = 60;

    const countdown = setInterval(() => {
      seconds--;

      if (seconds === 0) {
        seconds = 60
        clearInterval(countdown);
        setIsResendDisabled(false); // Enable the resend button after countdown ends
      }

      setTimer(seconds);
    }, 1000);
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex flex-col gap-4 w-[60%]'>
        <p className=' font-semibold text-2xl text-primary'>Email verification</p>
        <p className=' text-lg text-text_primary'>
          Click on the link sent to the email address {maskEmail()}.<br /><br />
          Haven't received the link?
          {isResendDisabled ? (
            <span className='text-gray-500 font-medium'>
              Resend the link in {timer} seconds.
            </span>
          ) : (
            <span className='text-primary font-medium cursor-pointer' onClick={handleResendEmail}>
              Resend the link.
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export default Email_verification