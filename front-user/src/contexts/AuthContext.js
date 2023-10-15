import { createContext,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./MessgeContext";

import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  // const {   setNotifications } = useStateContext()

  let baseUrl=process.env.REACT_APP_USERS_URL
  let baseUrl_SocialMedia = process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL;

  let [user , setUser] = useState({
    
  })

  let [here , setHere] = useState(false)


  let [authTokens, setAuthTokens] = useState(() =>
       localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : null
  );

  let [socialMedia, setSocialMedia] = useState([]);
  let [socialMediaAuth, setSocialMediaAuth] = useState({
    "telegram" : false , 
    "facebook" : false ,
    "whatsapp" : false , 
    "instagram": false ,
    });

  let [isPayment, setIsPayment] = useState(false);
  let [isLandingPage, setIsLandingPage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const history = useNavigate();

  let logoutUser = () => {
    setUser(null);
    setAuthTokens(null);
    setIsPayment(false);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    // setHere(false);
    history("/");
    setNotificationCount(0)
    // setNotifications([])
  };

  const getSocialMedia= async ()=>{ 
    if(authTokens!== null){
   
    try{
      let res  = await axios.get(`${baseUrl_SocialMedia}social-media-and-unread-conversations`,
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      )
      if (res.status === 200) {
        // Sign-up successful
        setSocialMedia(res.data)
        setSocialMediaAuth(
          {
            "telegram" :res.data.find((item)  => item.social_media  ===  "telegram" ),
            "facebook" :res.data.find((item)  => item.social_media  ===  "facebook" ),
            "instagram":res.data.find((item)  => item.social_media  === "instagram" ),
            "whatsapp" :res.data.find((item)  => item.social_media  ===  "whatsapp" ),



          }
        )

        
      }

    }
    catch(e){

    }
  }
  }

  const getUser= async ()=>{ 

    if(authTokens!== null){
      
    
    try{
      let res  = await axios.get(`${baseUrl}owner/details`,
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      )
      if (res.status === 200) {
     
      

      
        setHere(true)
        setUser(res.data.user)
        setNotificationCount(res.data.user.notifications_count)

        if(((res.data.user.is_trial_active && res.data.user.is_trial_expired))  ){
            
          setIsPayment(false)

        }else if(!res.data.user.is_trial_active && res.data.user.is_subscription_expired){
          setIsPayment(false) 
        }else{
          setIsPayment(true)
         
       
        }  
      }

    }
    catch(e){
 
      if (authTokens!== null) {
        logoutUser()
       }
     
     
      setHere(true)
     
    }
  }else{
    setHere(true)

  }
  }
  useEffect(()=>{
    
    getSocialMedia()
    getUser()
  },[authTokens])

  let contextData = {
    isPayment:isPayment,
    setIsPayment:setIsPayment,
    authTokens: authTokens,
    setAuthTokens:setAuthTokens,
    logoutUser: logoutUser,
    isLandingPage: isLandingPage,
    setIsLandingPage: setIsLandingPage,
    socialMedia :socialMedia  ,
    setSocialMedia : setSocialMedia,
    socialMediaAuth :socialMediaAuth  ,
    setSocialMediaAuth : setSocialMediaAuth,
    user : user,
    setUser:setUser,
    getUser:getUser,
    here:here,
    setHere:setHere,
    notificationCount:notificationCount,
    setNotificationCount:setNotificationCount,
    getSocialMedia:getSocialMedia,
    setShowNotifications:setShowNotifications,
    showNotifications:showNotifications

  };


  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
