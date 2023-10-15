import React,{useContext , useState} from 'react'
import axios from 'axios';
import AuthContext from "../../../contexts/AuthContext";
import Loader from '../../Loader';
import { useNavigate } from "react-router-dom";
import PopUpNotLinked from './PopUpNotLinked';

const PageGrid = ({PageData , current_SocialMedia}) => {
    let baseUrl=process.env.REACT_APP_SOCIALMEDIA_INTEGRATION_URL
    const history = useNavigate();

    const {authTokens , setSocialMediaAuth ,socialMediaAuth  } = useContext(AuthContext)
    const [loading,setLoading]=useState(false)
    const [showPopup,setShowPopup]=useState(false)
    const [detailPopup,setDetailPopup]=useState({
      title:"",
      desc:""
    })


   


    const linkPage = async (token) => {
         setLoading(true);
        
        try {  
          const response = await axios.post(`${baseUrl}${current_SocialMedia}/link-account?short-live-token=${token}`, 
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
            if(current_SocialMedia==="instagram"){
              setSocialMediaAuth({
                ...socialMediaAuth, 
                instagram: true, 
              });
              history('/instagram');
            }else if(current_SocialMedia==="facebook"){
              setSocialMediaAuth({
                ...socialMediaAuth, 
                facebook: true, 
              });
              history('/facebook')
            }
            else{
              setSocialMediaAuth({
                ...socialMediaAuth, 
                whatsapp: true, 
              });
              history('/whatsapp');
         
            }
         
           

            // Redirect or show success message
          }
        } catch (error) {
        
            console.log(error)
            
              setShowPopup(true)
             
              setDetailPopup({
                title:"already linked",
                desc:"this account is already linked to another account"
              })

              
              if(current_SocialMedia==="whatsapp"){
                setDetailPopup({
                  title:"Whatsapp Link Required",
                  desc:"You cannot continue until your Whatsapp account is linked to this page. or this account is already linked to another account "
                })
              }
             
          
        }
         setLoading(false); 
    }  



    async function isPageLinkedToInstagram(user) {
      try {
        // Make a GET request to check if the page is linked to an Instagram account
        const response = await axios.get(`https://graph.facebook.com/v17.0/${user.id}?fields=instagram_business_account&access_token=${user.access_token}`);
        console.log(response)

        const { data } = response;
        if (data.instagram_business_account) {
          // The page is linked to an Instagram account
           linkPage(user.access_token)

        
          return true;
        } else {
          // The page is not linked to an Instagram account
          setShowPopup(true)
          setDetailPopup({
            title:"Instagram Link Required",
            desc:"You cannot continue until your Instagram account is linked to this page."
          })
          return false;
        }
      } catch (error) {
        alert("Error")

        console.error('Error checking Instagram link:', error);
        throw error;
      }
    }
    

   
  return (
    <div className='flex flex-col w-full h-full '>
        <p className=' font-semibold text-lg  sm:mt-0 mt-20'>Choose one page to continue !</p>
        {
            !loading ? 
            <div className="grid grid-cols-1 mt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PageData.map((user, index) => (
        <div className="bg-background border cursor-pointer
         border-gray-300 p-4 rounded-lg text-center" 
         key={index}
         
         onClick={()=>{
          if(current_SocialMedia==="instagram"){
            isPageLinkedToInstagram(user)
          }
          else{
            linkPage(user.access_token)
          }
       
        }}
         
         >
            <p className="text-lg font-semibold mt-2">{user.name}</p>
        </div>
        ))}
         </div> :
         <div className=' w-full h-[450px] flex  justify-center items-center '>
                   <Loader/>
         </div>
 
      
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

export default PageGrid