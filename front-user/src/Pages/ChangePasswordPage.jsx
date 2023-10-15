import React , {useState , useEffect} from 'react'
import LeftContent from '../Components/Layout/LeftContent'
import { ChangePassword } from '../Routes'
import { useParams } from 'react-router-dom';
import axios from 'axios';
const ChangePasswordPage = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  const [loading,setLoading]=useState(false)

  const { token, uid } = useParams();


  return (
<div>
    <div className='flex w-full h-screen sm:flex-row flex-col-reverse' >
              <div  className="sm:w-[50%] sm:h-full w-full h-[50%]  ">
              <LeftContent/> 
             
              </div>
              <div className='sm:w-[50%] sm:h-full w-full h-[50%] ' >
               <ChangePassword token={token} uid={uid}/>
            
           </div>
         </div>
 </div>  )
}

export default ChangePasswordPage