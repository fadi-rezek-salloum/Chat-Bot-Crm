import React,{useContext ,useState,useEffect } from 'react'
import TopBar from '../../Components/Layout/TopBar'
import Conversation from '../../Components/SocialMedia/Conversation'
import ConversationMobile from '../../Components/SocialMedia/ConversationMobile'


import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import { useStateContext } from "../../contexts/MessgeContext";

const SocialMediaPage = ({socialMedia}) => {
    let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
    let url_GET_conversation=`${baseUrl}get-conversation`
     const {authTokens } = useContext(AuthContext)
     const {users, setUsers ,activeMenu , setCurrentConversation} = useStateContext()

     const [filtered, setFiltered] = useState(users);

     const [loadingUsers,setLoadingUsers]=useState(false)

     useEffect(() => {
      setCurrentConversation(socialMedia)
        getUsers();
      }, [socialMedia]);
 
     const getUsers = async () => {
      setLoadingUsers(true)
        try {
          const response = await axios.get(`${url_GET_conversation}?choice=${socialMedia.toLowerCase()}`, 
         
          {
            headers: {
              Authorization: `Bearer ${authTokens}`
            }
          }
          );
    
          console.log(response.data)
    
          if (response.status === 200) {
            // Sign-up successful
            setUsers(response.data.results)
            setFiltered(response.data.results)
            // Redirect or show success message
          }
        } catch (error) {
        
            console.log(error)
    
    
    
          
        }
        setLoadingUsers(false)
    
      }

 useEffect(() => {
    setFiltered(users);
  }, [users]);
    return (
        <div className='w-full h-full flex flex-col'>
           { authTokens && <TopBar
           title =  {socialMedia}
           description = "Keep conversations flowing and interactions dynamic"
           isSearch = {true}
           placeholderShearch = "Search conversations"
           list = {users}
           setFiltered = {setFiltered}
           className="z-10"
           /> }


<Conversation 
            users={filtered}
            setUsers = {setFiltered}
            className="z-20 "
            socialMediaConvesation={socialMedia}
            loadingUsers={loadingUsers}
         />
    <ConversationMobile
     typeSocialMedia = {socialMedia}
     descriptionSocialMedia = "Keep conversations flowing and interactions dynamic"
     list={users}
     users={filtered}

     setFiltered = {setFiltered}
     className="z-20 "
    />


    
           
         
     
     
    </div>
   
   )
}

export default SocialMediaPage