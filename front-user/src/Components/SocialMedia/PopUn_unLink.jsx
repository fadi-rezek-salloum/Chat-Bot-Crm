import React , {useContext , useState}  from 'react'
import {IoMdClose} from "react-icons/io"
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import Loader from '../Loader';
import { useNavigate } from "react-router-dom";

const PopUn_unLink = (props) => {
    let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
    const {authTokens ,setSocialMediaAuth , socialMediaAuth } = useContext(AuthContext)

    let url_unLinkTelegram=`${baseUrl}${props.currentsocialMedia}/unlink-account`
    const history = useNavigate();

    const [loading,setLoading]=useState(false)
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
            const a = `/link-${props.currentsocialMedia}`
            if(props.currentsocialMedia==="telegram"){
              setSocialMediaAuth({
                ...socialMediaAuth, 
                telegram: false, 
              });
            }else 
            if(props.currentsocialMedia==="instagram"){
              setSocialMediaAuth({
                ...socialMediaAuth, 
                instagram: false, 
              });
            }else if(props.currentsocialMedia==="whatsApp"){
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
  return (
    <div className=" relative  flex justify-center flex-col items-center animate-slideup
     bg-white dark:bg-[#1C1817]  md:w-[40%]  sm:w-[60%] w-[80%] h-[33%] rounded-2xl z-[10]   ">
    <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
      <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />


    </div>

    <div className='  justify-center items-center flex flex-col w-full gap-6' >
  
        <p className="text-primary text-lg text-center w-[80%] flex justify-center items-center  ">
        Are you sure you want to remove your link? This action will delete all messages
        </p>
        {loading ? <div className="  flex items-center justify-center  w-full mt-8 text-gradient-to-r from-[#EC3131] via-[#970505] to-[#852f2f]"> <Loader /> </div>    :

        <div className=' w-full flex flex-row gap-6 justify-center items-center' >
       

        <div className=' flex justify-end items-center w-[80%] gap-6 ' >
                <button 
                onClick={()=>{props.setShowPopup(false)}} 
                className=' text-white 
                 w-full
                 bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
                    py-4
                  rounded-3xl
                    flex items-center justify-center ' >
                   No
                </button>


                
                <button 
                
                className=' text-white 
                 w-full
                 bg-gradient-to-r from-[#EC3131] via-[#970505] to-[#852f2f] opacity-75
                    py-4
                  rounded-3xl
                   flex items-center justify-center shadow-md ' 
                   onClick={()=>{
                    unlinkTelegram()
                   }}
                   
                   >
                   Yes
                </button>
                
               
               

         </div>
    </div>
 }
    
   

    </div>
</div>
  )
}

export default PopUn_unLink