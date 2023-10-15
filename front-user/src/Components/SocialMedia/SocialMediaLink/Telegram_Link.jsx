import React , {useState , useContext} from 'react'
import {GiToken} from 'react-icons/gi'
import axios from 'axios';
import AuthContext from "../../../contexts/AuthContext";
import Loader from '../../Loader';
import SuccessLink from '../SuccessLink';
import PopUpNotLinked from './PopUpNotLinked';
const Telegram_Link = () => {
    let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
  
    const {authTokens , setSocialMediaAuth , socialMediaAuth} = useContext(AuthContext)


    const [botToken, setBotToken] = useState();
    const [loading,setLoading]=useState(false)
    const [issuccess,setIssuccess]=useState(false)
    const [showPopup,setShowPopup]=useState(false)
    const [detailPopup,setDetailPopup]=useState({
      title:"",
      desc:""
    })


 


    const handleChange = (e) => {
        setBotToken(e.target.value);
      };
    const linkTelegram = async () => {
        setLoading(true);
        
        try {  
          const response = await axios.post(`${baseUrl}telegram/link-account?token=${botToken}`, 
          {
           

          },
          {
            headers: {
              Authorization: `Bearer ${authTokens}`
            }
          }
          );
        //   props.setShowPopup(false)
          console.log(response)
          console.log(response.status)

          if (response.status === 200) {
            // Sign-up successful
          
            setIssuccess(true)

            setSocialMediaAuth({
              ...socialMediaAuth, 
              telegram: true, 
            });
            // Redirect or show success message
          }
        } catch (error) {
        
            console.log(error)

     
            if(error.response.data.message==="this account is already linked to another account"){
              setShowPopup(true)
              setDetailPopup({
                title:"already linked",
                desc:"this account is already linked to another account"
              })

            }

            
          
        }
        setLoading(false); 
    }  
  return (
    <div>

{
  !issuccess ?  
  <div className=' font-inter text-primary flex flex-col gap-4 px-10 py-6 '>
  <p className=' text-xl font-bold  sm:mt-0 mt-20'>First step </p>
  <p>You should link your platform with </p>


         <div>
         <div className={`border  py-2.5 px-5
           flex  justify-start items-center rounded-3xl 
           border-bg-gray_color  w-[70%]         
           `}>
         
           <GiToken className='w-[20px] h-[20px] text-gray_color' />
           
           <input className='focus:outline-none px-2 py-0.5 w-full  '
             type='text'
             name="token"
             value={botToken}
             onChange={handleChange}
           placeholder="Your bot token"/>
         
         </div>
       </div>

       {
       loading ? 
       <div className="">
            <Loader />
       </div>  
       :  
       <div
           className=' font-medium border border-primary border-solid w-max px-6 py-1.5 rounded-3xl cursor-pointer'
           onClick={linkTelegram}>
               Link Telegram now
       </div> 
       }



   <p className=' text-xl font-bold  mt-6'>Create a Telegram Bot:</p>
   <ul>
       <li>Open the Telegram app and search for the "BotFather" bot.</li>
       <li>Start a chat with BotFather and use the /newbot command to create a new bot.</li>
       <li>Follow the instructions to set a name andusername for your bot, and BotFather will provide you with a unique API token.</li>
   </ul>
   
</div> : <SuccessLink title = "Telegram was linked succussfuly"/>
}
       


        {
          showPopup && 
          <div className=" fixed left-0 top-0 w-[100%] 
          h-screen bg-black 
          bg-opacity-60 backdrop-blur-[1px] 
          z-[9999] flex justify-center items-center  ">

                  <PopUpNotLinked 
                  setShowPopup = {setShowPopup}
                  detailPopup = {detailPopup}
                  />

          </div>
          
          
        }

    </div>
  )
}

export default Telegram_Link