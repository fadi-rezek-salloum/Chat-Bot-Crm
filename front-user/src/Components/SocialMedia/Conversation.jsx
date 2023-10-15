import React,{useContext , useState,useEffect} from 'react'
import avatar_1 from '../../Assets/avatar-1.png'
import AuthContext from "../../contexts/AuthContext";
import axios from 'axios';
import Messages from './Messages';
import { useStateContext } from "../../contexts/MessgeContext";
import {  BiMessageSquareCheck , BiSolidMessageSquareDots} from 'react-icons/bi'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Loader from '../Loader';

const Conversation = ({ users, setUsers , loadingUsers}) => {
  const { openconversation , setOpenconversation } = useStateContext()

  const location = useLocation();
  const currentsocialMedia = location.pathname.substring(1 , location.pathname.length);


  // useEffect(() => {

  //   setCurrentConversation(location.pathname.substring(1 , location.pathname.length))
   
  // }, []);
  let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
  let url_Read_conversation=`${baseUrl}conversation-read/`
  let url_unLinkTelegram=`${baseUrl}${currentsocialMedia}/unlink-account`
  
  const [loading,setLoading]=useState(false)

  const {authTokens  , setSocialMediaAuth , socialMediaAuth, setSocialMedia , socialMedia , user } = useContext(AuthContext)
  const [id, setId] = useState("0");
  const [name, setName] = useState("0");

  const history = useNavigate();


  
 

  const read_Conversation = async (idC) => {
    try {

      const response = await axios.post(`${url_Read_conversation}${idC}`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      
      );

      console.log(response)
      if (response.status === 200) {
        const updatedConversation = users.map((user) =>
        user.id === idC ? { ...user, is_read: true } : user
      );

      setUsers(updatedConversation);

      // if(socialMediaConvesation==="telegram"){
      //   setSocialMedia({
      //     ...socialMedia, 
      //     telegram: true, 
      //   });
      // }
     


      }
    } catch (error) {
    
        console.log(error)


      
      
    }
    // setIsLoading(false); // Stop loading indicator

  }

  function areAllItemsRead(items) {
    // Use the Array.every() method to check if all items have isRead === true
    return items.every(item => item.isRead === true);
  }

  const unlinkTelegram = async () => {
    setLoading(true)

    try {  
      const response = await axios.post(`${url_unLinkTelegram}`, 
      {
       

      },
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
    //   props.setShowPopup(false)
     

      if (response.status === 200) {
        // Sign-up successful
      
        const a = `/link-${currentsocialMedia}`
        if(currentsocialMedia==="telegram"){
          setSocialMediaAuth({
            ...socialMediaAuth, 
            telegram: false, 
          });
        }else if(currentsocialMedia==="instagram"){
          setSocialMediaAuth({
            ...socialMediaAuth, 
            instagram: false, 
          });
        }else if(currentsocialMedia==="whatsApp"){
          setSocialMediaAuth({
            ...socialMediaAuth, 
            whatsApp: false, 
          });
        }
        else{
          setSocialMediaAuth({
            ...socialMediaAuth, 
            facebook: false, 
          });
        }

       
        history(a , { state: { link:"true" } } );

        // Redirect or show success message
      }
    } catch (error) {
    
        console.log(error)



        
      
    }
    setLoading(false)

}
function formatTime(isoTimestamp) {
  const dateObject = new Date(isoTimestamp);
  const hour = dateObject.getHours();
  const minute = dateObject.getMinutes();
  return `${hour}:${minute}`;
}


  
  return (
    <div className='px-10 py-6 w-full h-[80%] sm:block hidden  '>
      {
        loadingUsers ? <div className=' w-full h-full  justify-center items-center sm:flex hidden '><Loader/></div> : <div className=' w-full h-[100%] sm:block hidden '>

{
        users.length !== 0 ? 
        <div className='font-inter text-primary flex   
          rounded-2xl  w-full h-full  mt-4 bg-white shadow-[0_5px_16px_0px_rgba(0,0,0,0.1)]
          '>
            <div className='w-[30%] h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'
             style={{
              scrollbarWidth: 'thin', // For WebKit browsers
              scrollbarColor: '#718096 #f7fafc' // For WebKit browsers
            }}
            >
            {users.map((user, index) => (
            
          <div key={index} className='flex py-3 px-2 gap-3 w-full border-b cursor-pointer'
              onClick={()=>{
                setId(user.id)
                setOpenconversation(user )
                read_Conversation(user.id)
              
                {
                  currentsocialMedia ==="facebook" || currentsocialMedia ==="instagram"  ? 
                  setName(`${user.sender_username}`)

                  :
                  setName(`${user.sender_first_name} ${user.sender_last_name}`)

                }
              }}
          >
          <img src={avatar_1} alt="" className='h-7 w-7 rounded-full'/>
          <div className='flex flex-col w-full '>
              <div className='flex justify-between w-full '>
       
                    {
                      currentsocialMedia ==="facebook"|| currentsocialMedia ==="instagram" ? 
                      <p className='text-sm font-semibold'>{user.sender_username} </p>

                      
                      :
                      <p className='text-sm font-semibold'>{user.sender_first_name} {user.sender_last_name}</p>

                    }
                    
                  
                  <p className='text-[10px] text-gray_color '>{formatTime(user.last_message_time)}</p>
              </div>
              <div className='flex  w-full justify-between items-center'>
              <p className='text-xs text-gray-500  max-w-[50%] truncate'>
                { user.last_message.length > 20
                  ? user.last_message.slice(0, 20 - 3) + '...' // Add '...' at the end
                  : user.last_message
                }
                </p>
                  {
                    !user.is_read ?
                    
                    <BiSolidMessageSquareDots/>

                    // <p className='bg-primary h-5 w-5 flex justify-center items-center text-white rounded text-center text-[10px]'>1</p>
                    :
                    <BiMessageSquareCheck/>
                  }
              </div>
            </div>
      </div>
      ))}
            

             

            </div>
            <div className='w-[70%] h-[550px] bg-background shadow '>
              {
                openconversation !== null && name!=="0"  ?  
                <Messages photo = {avatar_1} name={name} id = {id}
                conversation = {openconversation}
                currentsocialMedia = {currentsocialMedia}
                
                
               
                />
                :
                <div className='w-full h-full flex
                justify-center items-center
                 text-center text-lg font-inter' >Please select a conversation</div>
              }
            </div>
            
      </div>
       : 
      <div className='py-10 px-4 w-full h-[550px]
       bg-white shadow-[0_5px_16px_0px_rgba(0,0,0,0.1)]
      flex flex-col gap-7 justify-center items-center text-primary text-lg font-inter'>
        <p>You don't have any conversations</p>
        {
          user.role ==="owner" ? <button 
                
          className=' text-white 
           w-[15%]
           bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
                               py-3
            rounded-3xl
             flex items-center justify-center shadow-md ' 
             onClick={()=>{
              unlinkTelegram()
             }}
             
             >
             Un Link
          </button> :<div></div>
        }
      
         </div>
      }


        </div>
       }
      
      
      

     
    </div>
  )
}

export default Conversation