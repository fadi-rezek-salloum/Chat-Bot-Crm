import React , {useState , useEffect} from 'react'
import Account_verified from '../Components/SignUp/Account_verified'
import LeftContent from '../Components/Layout/LeftContent'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifiedPage = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const [loading,setLoading]=useState(false)

  const { token, uid } = useParams();

  const [resulte , setResulte] = useState({}) 

  const verifyToken = async () => {
    setLoading(true);
      try {  
        const response = await axios.get(`${baseUrl}verify-email/${token}/${uid}/`,
      
        );
      //   props.setShowPopup(false)
     

        if (response.status === 200) {
        
          setResulte(
            {
              title:"Account verified !",
              desc : "Just one step away from unlocking premium features.Complete your registration by subscribing now and dive into a world of enhanced social interactions."
            }
          )
         

          }
      } catch (error) {
      
          console.log(error)

            setResulte(
              {
                title:"Account not verified !",
                desc : "Token is invalid or expired"
              }
            )
          
  
     
        
      }
      setLoading(false); 
  
    }

    useEffect(() => {
      verifyToken();
     }, []);
     
  return (
    <div>
    <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
              <div  className="sm:w-[50%] sm:h-full w-full h-[50%]  ">
              <LeftContent/> 
             
              </div>
              {

              }
        
              <div className='sm:w-[50%] sm:h-full w-full h-[50%] ' >
               <Account_verified  resulte={resulte}/>
            
           </div>
         </div>
 </div>
  )
}

export default VerifiedPage