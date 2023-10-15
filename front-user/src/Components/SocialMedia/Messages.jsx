import React,{useState , useContext , useEffect , useRef } from 'react'
import Message from './Message'
import {AiOutlineSend} from 'react-icons/ai'
import {BiUnlink , BiSubdirectoryRight} from 'react-icons/bi'



import AuthContext from "../../contexts/AuthContext";
import { useStateContext } from "../../contexts/MessgeContext";
import {CiMenuKebab} from 'react-icons/ci'
import {IoIosArrowBack} from 'react-icons/io'



import axios from 'axios';
import PopUp_Redirect from './PopUp_Redirect';
import PopUp_unLink from './PopUn_unLink'
import PopUp_succussfully from '../Agents/PopUp_succussfully';

const Messages = ({photo , name , id , conversation,currentsocialMedia , isMobile , setName}) => {
  const messageContainerRef = useRef(null);

  let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
  let url_GET_messages=`${baseUrl}get-messages`
  let url_send_message =  `${baseUrl}${currentsocialMedia}/send_message`


  const {authTokens } = useContext(AuthContext)
  const {messages, setMessages  , setOpenconversation} = useStateContext()

  const [messageInput, setMessageInput] = useState();
  const [showPopup, setShowPopup] = useState(false);



  
  const [limit, setLimit] = useState();
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false); // State for the loader
  const [typePopup, setTypePopup] = useState({
    type:"",
    text:""
});
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const handleScroll = (e) => {
    e.preventDefault(); // Prevent the default behavior
    e.stopPropagation(); // Stop event propagation
  
    // console.log(e.currentTarget)
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // console.log(scrollTop +"//"+ scrollHeight+"//"+clientHeight)
    console.log(scrollTop +"//" + scrollHeight+"//"+clientHeight)
    if (scrollTop ===0  && !showLoader ) {
      // User has scrolled to the bottom
      // Increment the offset to load more notifications
      setShowLoader(true)
      setOffset((prevOffset) => prevOffset + 10);

      getMessages(offset+10);
    }
  };



  const getMessages = async (offsetA) => {
    const container = messageContainerRef.current;

    if ( loading) return;

    setLoading(true);
  
    try {
    

      const response = await axios.get(`${url_GET_messages}?conversation_id=${id}&limit=${10}&offset=${offsetA}`, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
      if (response.status === 200) {
        const newMessages = response.data.results;
        console.log(newMessages)
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);

     
       
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
      setShowLoader(false); // Hide loader after messages are loaded

    }
  }
  useEffect(() => {
    setMessages([])
    setOffset(0)
    getMessages(0);
    
   
  }, [id]);
 
  
// useEffect(() => {
  
//   if(offset===0){
  

//   const container = messageContainerRef.current;

//   if (container) {
//     // Scroll to the bottom of the container
//     container.scrollTop = 220;
//   }
// }
// }, [messages]);
// useEffect(() => {
//   const container = messageContainerRef.current;
//   if (container ) {
//     // Set the scroll position to the maximum
//     container.scrollTop = container.scrollHeight;
//   }
// }, []);
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    // Call your function here
    send_Message();
  }
};

  const send_Message = async () => {
    setMessageInput("")
    if(messageInput){
      try {

        const response = await axios.post(`${url_send_message}?conversation_id=${conversation.conversation_id}&message=${messageInput}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
  
       
      } catch (error) {
      
          console.log(error)
  
  
  
        
      }
    }
  
    // setIsLoading(false); // Stop loading indicator

  }

  const handleChange = (e) => {
    setMessageInput(e.target.value)
  };



  

  return (
    <div className='w-full h-full pb-5'>
        <div className="  bg-white  p-4
          h-[10%] flex  justify-between items-center ">
              <div className='flex gap-5 justify-start items-center'>
                {
                  isMobile &&   <IoIosArrowBack className=' cursor-pointer ' 
                    onClick={()=>{
                      setOpenconversation(null)
                      setName("0")
                    }}
                  
                  />
                }
              
                <img className='h-10 w-10 rounded-full' src={photo} alt=''/>
                <span className="" >{name}</span>
              </div>
              <div className=' flex justify-center items-center  cursor-pointer' onClick={toggleMenu}>
              {isMenuOpen && (
                    <div className=" bg-white p-2 px-3 mt-10 z-[1000] shadow font-inter text-sm rounded-xl gap-2">
                      <div 
                        className='flex gap-2 py-2 justify-center items-center '
                        onClick={
                          ()=>{
                            setShowPopup(true);
                            setTypePopup({type:"redirect"})
                          }
                        }
                      >
                        <BiSubdirectoryRight className="text-primary"/>
                        Redirect to a department
                      
                      </div>
                      <div
                      className='flex gap-2'

                      onClick={
                        ()=>{
                          setShowPopup(true);
                          setTypePopup({type:"unLink"})
                        }
                      }
                      >
                       <BiUnlink className="text-primary"/>

                        UnLink
                      
                      </div>

                    </div>
              )}
            <CiMenuKebab className='' />
              </div>
            
            

         </div>
         <div className=' w-full flex flex-col justify-center items-center h-[80%] mb-2 '>
         {showLoader && <div className="text-center py-2">Loading...</div>} {/* Display loader when loading more messages */}
         
              <div className="w-[95%] h-[100%]  overflow-y-auto scrollbar-none scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                 onScroll={handleScroll}
                 
                 ref={messageContainerRef}

              >
                  <div className="h-auto min-h-full  flex  flex-col-reverse gap-3 py-2  overflow-y-auto "
                       
                        // onScroll={handleScroll}
                        
                        >
                          {/* Messages */}
                          {messages.slice().map((m) => (
                            <Message message={m} key={m.id} />
                          ))}
                  </div>
              </div>
         </div>
      <div className=' w-full flex justify-center items-center h-[10%] '>
        <div className=' w-[95%] px-4 mb-2  bg-white h-full
        rounded gap-3 flex justify-between items-center'>
          <input
            type="text"
            className='w-[90%] bg-white focus:outline-none px-2 py-0   '
            placeholder="Type something..."
            name="message"
            value={messageInput}
            onChange={handleChange}
            onKeyDown={handleKeyPress}

          />

            <div className="flex">
            
              <AiOutlineSend className="w-6  text-primary h-6 cursor-pointer" onClick={()=>{
                send_Message()}} />
            </div>
          </div>
      </div>


      {showPopup && (
        <div className=" fixed left-0 top-0 w-[100%] 
         h-screen bg-black 
         bg-opacity-60 backdrop-blur-[1px] 
         z-[9999] flex justify-center items-center  ">
         {
            typePopup.type==="redirect" ? (
              <PopUp_Redirect
              setShowPopup={setShowPopup}
              conversation= {conversation}
              setTypePopup={setTypePopup}
            />
            ) : typePopup.type==="unLink" ? (
              <PopUp_unLink
              setShowPopup={setShowPopup}
              currentsocialMedia={currentsocialMedia}
            />
            ) 
            
            : 
            <PopUp_succussfully
            setShowPopup={setShowPopup}

            typePopup={typePopup}
            /> 
         }
         

          
          
        </div>
      )
      
      
      
      }


    
    </div>
  )
}

export default Messages