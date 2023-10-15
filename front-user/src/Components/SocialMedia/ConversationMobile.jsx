import React,{useState} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import { useStateContext } from "../../contexts/MessgeContext";
import avatar_1 from '../../Assets/avatar-1.png'
import {  BiMessageSquareCheck , BiSolidMessageSquareDots} from 'react-icons/bi'
import Messages from './Messages';
import { useLocation } from 'react-router-dom';

const ConversationMobile = ({typeSocialMedia ,descriptionSocialMedia ,users,list,setFiltered}) => {
    const {openconversation , setOpenconversation } = useStateContext()
    const location = useLocation();
    const currentsocialMedia = location.pathname.substring(1 , location.pathname.length);
  
    const [id, setId] = useState("0");
    const [name, setName] = useState("0");
       const [searchTerm, setSearchTerm] = useState('');
       const handleSearch = (e) => {
     if(typeSocialMedia === "telegram"){
      
          const filtered = list.filter((item) =>

          {
            const name = `${item.sender_first_name} ${item.sender_last_name}`;
            return name.toLowerCase().includes(e.target.value.toLowerCase());
          }
          
          
          );
        
        
          setFiltered(filtered);
    
        }else{
          const filtered = list.filter((item) =>

          {
            return item.sender_username.toLowerCase().includes(e.target.value.toLowerCase());
          }
          
          
          );
        
        
          setFiltered(filtered);
        }
       
    
      };
  return (

    <div className='sm:hidden flex h-[650px] flex-col mt-24 text-primary font-intergap-2'>
        {
             openconversation !== null && name!=="0"?
             <div className='w-full h-full font-inter text-primary  flex  bg-background   
             '>
                 <Messages photo = {avatar_1} name={name} id = {id}
                conversation_id = {openconversation} isMobile={true}
                setName = {setName}
                />
             </div>
              : 
              <div className='flex flex-col w-full h-full  px-4 py-4   '>
                <p className='font-bold text-3xl'>{typeSocialMedia}</p>
                <p className='text-sm'>{descriptionSocialMedia}</p>
                <div className='  border border-gray_color px-4 py-4 mt-4  
                h-[42px]  rounded-3xl  flex justify-start items-center w-full'>
                    <AiOutlineSearch className='w-[20px] h-[20px] text-gray_color '/>
                    <input className='focus:outline-none w-full text-sm  px-2 ' 
                    placeholder="Search conversations"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      handleSearch(e);
                    }}
                    
                    />
                </div> 
                <div className='font-inter text-primary flex    bg-white 
                rounded-2xl  w-full h-full  mt-4
                '>
                <div className='w-full h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'
                    style={{
                    scrollbarWidth: 'thin', // For WebKit browsers
                    scrollbarColor: '#718096 #f7fafc' // For WebKit browsers
                    }}
                    >
                    {users.map((user, index) => (
                <div key={index} className='flex py-3 px-2 gap-3 w-full border-b cursor-pointer'
                    onClick={()=>{
                        setId(user.id)
                        setOpenconversation(user.conversation_id)
                        // read_Conversation(user.id)
                        setName(`${user.sender_first_name} ${user.sender_last_name}`)
                        {
                          currentsocialMedia ==="telegram"  ? 
                          setName(`${user.sender_first_name} ${user.sender_last_name}`)

                          :
                          setName(`${user.sender_username}`)

                        }
                    }}
                >
                <img src={avatar_1} alt="" className='h-7 w-7 rounded-full'/>
                <div className='flex flex-col w-full '>
                    <div className='flex justify-between w-full '>
                    {
                      currentsocialMedia ==="telegram" ? 
                      <p className='text-sm font-semibold'>{user.sender_first_name} {user.sender_last_name}</p>

                      
                      :
                      <p className='text-sm font-semibold'>{user.sender_username} </p>

                    }

                        <p className='text-[10px] text-gray_color '>2022-09-11</p>
                    </div>
                    <div className='flex  w-full justify-between items-center'>
                    <p className='text-xs text-gray-500  max-w-[50%] truncate'>
                        { user.last_message.length > 20
                        ? user.last_message.slice(0, 20 - 3) + '...' 
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

                </div>
             </div>
         
        }
        
    </div>
  )
}

export default ConversationMobile