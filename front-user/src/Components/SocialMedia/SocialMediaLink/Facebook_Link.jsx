import React,{useState  , useEffect} from 'react';
import axios from 'axios';
import PageGrid from './PageGrid';
import {  toast } from 'react-toastify';

const Facebook_Link = ({current_SocialMedia}) => {
  const appId=process.env.REACT_APP_APP_ID

  const [pageAccounts, setPageAccounts] = useState('');
  
  const [loggedIn, setLoggedIn] = useState(false);
  let scope = ""

  if(current_SocialMedia === "facebook"){
    scope="public_profile,email,pages_show_list,pages_messaging,pages_messaging_subscriptions,pages_read_engagement,pages_manage_metadata"
  }else if(current_SocialMedia === "instagram"){
    scope="email,pages_show_list,pages_manage_metadata,instagram_basic,instagram_manage_messages"
  }else{
    scope = "pages_show_list,pages_manage_metadata,whatsapp_business_management,whatsapp_business_messaging"
  }

  const responseFacebook = (response) => {
    console.log(response)
    if (response.accessToken) {
   
      exchangeUserTokenForPageToken( response.id, response.accessToken)
    } else {
      setLoggedIn(false);
    }
  };

  const exchangeUserTokenForPageToken = async (userId , userAccessToken) => {
    

    // Define the URL for the GET request.
    const apiUrl = `https://graph.facebook.com/${userId}/accounts?fields=name,access_token&access_token=${userAccessToken}`;

    // Make the GET request using Axios.
    axios.get(apiUrl)
      .then((response) => {
        // Extract the Page accounts data from the response.
        const { data } = response;
        setLoggedIn(true);
        if (data && data.data) {
          setPageAccounts(data.data);
        }
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching Page accounts:', error);
      });
  };



  
  useEffect(() => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v18.0', // Use the desired Facebook Graph API version
      });

      // Check the login status when the component mounts
      window.FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          // User is logged in and authenticated
          console.log(response)
          const accessToken = response.authResponse.accessToken;
          exchangeUserTokenForPageToken( response.authResponse.userID, response.authResponse.accessToken)

        }
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

 

  const handleFacebookLogin = () => {
    // Trigger the Facebook login dialog with additional permissions
    try {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          // User is logged in and authenticated
          const accessToken = response.authResponse.accessToken;
          console.log(response);
          // sendTokenToAPI(accessToken);
          exchangeUserTokenForPageToken( response.authResponse.userID, response.authResponse.accessToken)

        } else {
          // User canceled login or didn't authorize the app
          console.log('Facebook login canceled or not authorized.');
        }
      },
      {
        scope:scope,
      }
    );
  } catch (error) {
    console.error('Error during Facebook login:', error);
    toast.error("Please check your internet connection.")

  }
  };
  

 
  return (
    <div>
      
      {loggedIn ? (
        <div className=' px-10 py-6 text-primary font-inter '>
          <PageGrid PageData={pageAccounts} current_SocialMedia = {current_SocialMedia}/>
        </div>
      ) : (
        <div className='font-inter text-primary flex flex-col gap-4 px-10 py-6 '>
            <p className=' text-xl font-bold  sm:mt-0 mt-20'>First step </p>
            <p>
            {`You should link your platform with ${current_SocialMedia}`}


            </p>
            <div className='bg-white  border border-primary px-8 text-base font-semibold py-2 rounded-3xl w-max  cursor-pointer '
            onClick={handleFacebookLogin}
            >
           {`Link ${current_SocialMedia} now`}

            </div>

          
        </div>
       
      )}
    </div>
  );
}


export default Facebook_Link





















