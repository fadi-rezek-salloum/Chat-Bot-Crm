import { createContext,useState, useEffect,useContext } from "react";
 import axios from "axios";
 import AuthContext from "./AuthContext";

const StateContext = createContext();


export const MessageProvider = ({ children }) => {

    let baseUrl_socket=process.env.REACT_APP_WEBSOCKET_URL
    let origin=process.env.REACT_APP_ORIGIN
    let url_GET_notifications=process.env.REACT_APP_NOTIFICATIONS_URL

    const {authTokens  , setNotificationCount } = useContext(AuthContext)

  const [openconversation, setOpenconversation] = useState({});
  const [currentConversation, setCurrentConversation] = useState();

  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);





  useEffect(() => {
    if(authTokens !== null){

    let valueIsRead = false;
    
    // Define the WebSocket URL with the token
    const webSocketUrl = `${baseUrl_socket}socialMediaIntegration?token=${authTokens}`;
  
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
    
    socket.addEventListener('message', (event) => {
      setCurrentConversation((currentConversation)=>{
        const eventData = JSON.parse(event.data);
        let newMessage = eventData.message;
        console.log(newMessage)
        if(newMessage.account_social_media === currentConversation){
        
          setOpenconversation((conversation)=>{
            valueIsRead = !newMessage.from_customer;
            if(newMessage.conversation_id === conversation.conversation_id){
             
              valueIsRead = true;
              setMessages((prevMessages) => {
                // Check if newMessage.id already exists in prevMessages
                const messageExists = prevMessages.some((message) => message.id === newMessage.id);
              
                if (messageExists) {
                  // Message with the same id exists, return prevMessages as is
                  return prevMessages;
                } else {
                  // Message with new id, add it to the beginning of prevMessages
                  return [newMessage, ...prevMessages];
                }
              });
           }
          
           setUsers((prevUsers) => {
    
    
            let updatedItems = prevUsers.filter((user) => {
              return user.conversation_id === newMessage.conversation_id 
            });
    
            if(updatedItems.length !== 0){
           
              updatedItems = {...updatedItems[0],
                last_message: newMessage.message,
                is_read : valueIsRead,
                last_message_time : newMessage.created_at,
    
              
               }
            }else  {
              updatedItems = {
                last_message: newMessage.message,
                is_read : valueIsRead,
                deparetment:[1],
                conversation_id: String( newMessage.conversation_id),
                created_at:newMessage.created_at ,
                id:newMessage.conversation_real_id ,
                last_message_time : newMessage.created_at,
                sender_first_name : newMessage.sender_first_name,
                sender_last_name : newMessage.sender_last_name,
                sender_username : newMessage.sender_username,
    
              }
    
            }
           
             
          
    
            // Create a new array with items that do not match the specific changes
            const unchangedItems = prevUsers.filter((user) => {
              return user.conversation_id !== newMessage.conversation_id 
            });
          
            // Place the updated items at the beginning of the list
            // const updatedUsers = [updatedItems, ...unchangedItems];
            // console.log(updatedUsers)
    
            return [updatedItems, ...unchangedItems];
            });
    
    
    
            return conversation;
          })
        }
      
        return currentConversation
      })


    
    
   
    });

    
    
  
    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });
  
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };}
  }, [authTokens]);



  const [notifications, setNotifications] = useState([]);
  const [offset, setOffset] = useState(0);


  useEffect(() => {
    if(authTokens !== null){

    
    // Define the WebSocket URL with the token
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

        setNotificationCount((prevCount)=>prevCount+1)
       
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
    };


  }
  }, [authTokens]);
  



   useEffect(() => {
    if(authTokens !== null){
      getNotifications(authTokens);

    }
   }, [offset]);
 
 //API Request Get All Agent
 const getNotifications = async (authTokensA) => {
 
 try {
 
   const response = await axios.get(`${url_GET_notifications}?limit=${5}&offset=${offset}`, 
  
   {
     headers: {
       Authorization: `Bearer ${authTokensA}`
     }
   }
   );
   if (response.status === 200) {
     // Sign-up successful

     if (Array.isArray(response.data.results)) {
      setNotifications((prevNotigications) => 
      [...prevNotigications, ...response.data.results]);

    } else {
      
      // Handle the error or unexpected response structure as needed.
    }

     // Redirect or show success message
   }
 } catch (error) {
 
 
 
 
   
 }
 
 }




  let contextData = {
    setCurrentConversation:setCurrentConversation,
    messages:messages,
    setMessages:setMessages,
    users:users,
    setUsers:setUsers,
    openconversation : openconversation , 
    setOpenconversation : setOpenconversation,
    notifications:notifications,
    setOffset:setOffset,
    getNotifications:getNotifications,
    setNotifications:setNotifications
  };

  return (
    <StateContext.Provider  value={contextData}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
