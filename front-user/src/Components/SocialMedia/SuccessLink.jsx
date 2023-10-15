import React,{useContext} from 'react'
import Success from '../../Assets/Success.svg'
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

const SuccessLink = ({title  }) => {
  const history = useNavigate();
  let {socialMediaAuth , setSocialMediaAuth } = useContext(AuthContext);

  return (
    <div className='font-inter  flex flex-col gap-8 px-10 py-6'>
    <img  className="h-32 w-32" src={Success} alt=''/>
    <p className=' text-xl font-bold text-primary'>{title}</p>
    <p className=' text-primary'>You can now start using the platform</p>

    <div 
      onClick={()=>{
        history('/telegram');
        setSocialMediaAuth(
          {
            "telegram" : true
          }
        )
      }}
    
    className=' font-medium border  cursor-pointer text-primary border-primary border-solid w-max px-6 py-1.5 rounded-3xl'>
    Show messages</div>

    </div>
  )
}

export default SuccessLink