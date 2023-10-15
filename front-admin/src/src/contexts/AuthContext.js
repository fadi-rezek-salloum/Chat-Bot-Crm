import { createContext,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";

const AuthContext = createContext();

export default AuthContext ;

export const AuthProvider = ({ children }) => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const [showNotifications, setShowNotifications] = useState(false);

  let url_refresh=`${baseUrl}token/refresh`
  let url_verify=`${baseUrl}token/verify`

  let baseUrl_socket=process.env.REACT_APP_WEBSOCKET_URL
  let origin=process.env.REACT_APP_ORIGIN
  let url_GET_notifications=process.env.REACT_APP_NOTIFICATIONS_URL
  // const baseUrl = process.env.REACT_APP_AUTH_BASE_URL
  const [status,setStatus]=useState(false)
  let [authTokens, setAuthTokens] = useState(() =>
  localStorage.getItem('accessTokenAdmin')
 ? localStorage.getItem('accessTokenAdmin')
 : null
);
const [notifications, setNotifications] = useState([]);
const [offset, setOffset] = useState(0);
let [user , setUser] = useState({})
const [notificationCount, setNotificationCount] = useState(0);

useEffect(() => {
  // Define the WebSocket URL with the token
  if(authTokens!== null){

  const webSocketUrl = `${baseUrl_socket}notification?token=${authTokens}`;

  // Define the Origin header
  const webSocketHeaders = {
    origin: origin,
  };

  // Create a WebSocket connection
  const socket = new WebSocket(webSocketUrl, [], webSocketHeaders);

  // WebSocket event listeners
  socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
  });
  const markNotificationAsRead = (notificationId) => {
    console.log(notifications)
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    console.log(updatedNotifications)
    setNotifications(updatedNotifications);
  };
  socket.addEventListener('message', (event) => {
    console.log( event.data);
    const eventData = JSON.parse(event.data);

// Extract the notifications array from the eventData

  let newNotifications = eventData.notifications;
  if(newNotifications===undefined) 
  {
    newNotifications = eventData.notification
    if(!newNotifications.is_read){
      setNotifications((prevNotifications) => [
      
        newNotifications,
        ...prevNotifications,
      ]);

     
    }else{
      setNotifications((prevNotifications) =>
  prevNotifications.map((notification) =>
    notification.id === newNotifications.id
      ? { ...notification, is_read: true }
      : notification
  )
);
    }
  
  
  }
  
  else{
    setNotifications(
      newNotifications
    );
  }
   
 
    // Handle the received WebSocket message here
  });

  socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);

  });

  // Clean up the WebSocket connection when the component unmounts
  return () => {
    socket.close();
  };}
}, [authTokens]);
useEffect(() => {
  if(authTokens!== null){
    getNotifications(authTokens);

  }
 }, [offset]);




 useEffect(() => {
  // getUser()
  verifyToken()
 }, []);

  const history = useNavigate();

  let logoutUser = () => {
    setAuthTokens(null);
    // setUser(null);
    // Cookies.remove('token');
    localStorage.removeItem('refreshTokenAdmin');
    localStorage.removeItem('accessTokenAdmin');
    history("/login");
    setNotifications([])
  };


  const getNotifications = async (authTokensA) => {
   
    try {
    
      const response = await axios.get(`${url_GET_notifications}?limit=${5}&offset=${offset}`, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokensA}`
        }
      }
      );
      console.log(response)
      if (response.status === 200) {
   
  

         if (Array.isArray(response.data.results)) {
          setNotifications((prevNotifications) => 
          [...prevNotifications, ...response.data.results]);
  
          const unreadCount = response.data.results.filter((message) => !message.is_read).length;
          setNotificationCount((prevNotifications) => prevNotifications+unreadCount

          );
        } else {
          console.error("response.data.results is not an array");
          // Handle the error or unexpected response structure as needed.
        }
      }
    } catch (error) {
    
        console.log(error)
    
    
    
      
    }
    
    }

   
    const refreshToken = async () => {
            if(authTokens!== null){

      try {
  
       
  
        const response = await axios.post(url_refresh, 
        {
          "refresh":localStorage.getItem('refreshTokenAdmin')
        }
        
        );
        if (response.status === 200) {
          // Sign-up successful

          localStorage.setItem('accessTokenAdmin', response.data.access);
   
          // Redirect or show success message
        }
      } catch (error) {
   
  
  
        
      }
    }
    }



    const verifyToken = async () => {
      if(authTokens!== null){
    
      
      try {
  
       
  
        const response = await axios.post(url_verify, 
        {
          "token":localStorage.getItem('accessTokenAdmin')
        }
        
        );
   
       
      } catch (error) {
       

        if (authTokens!== null) {
          logoutUser()
         }
  
        
      }
    }
    }

  let contextData = {
    // user: user,
    authTokens: authTokens,
    logoutUser: logoutUser,

    // setUser: setUser,
    setAuthTokens:setAuthTokens,
    status:status,
    setStatus:setStatus,
    notifications:notifications,
    getNotifications:getNotifications,
    setOffset:setOffset,
    notificationCount:notificationCount,
    user : user,
    setUser:setUser,
    showNotifications:showNotifications,
    setShowNotifications:setShowNotifications,
    setNotificationCount:setNotificationCount
  };

  useEffect(() => {

    let hour = 1000 * 60 * 60 ;
    let interval = setInterval(() => {
      if (authTokens) {
        refreshToken();
      }
    }, hour);
    return () => clearInterval(interval);
  }, [authTokens]);
  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
