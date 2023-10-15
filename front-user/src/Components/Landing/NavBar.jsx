import React ,{useContext} from 'react'
import logo from '../../Assets/logo_primary.svg'
import { Link } from "react-scroll";
import { Link as Link1 } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import {BsFillPersonFill} from 'react-icons/bs'

const NavBar = () => {
  const {authTokens , user} = useContext(AuthContext)

  return (
    <div className='w-full flex flex-col lg:flex-row justify-between items-center font-inter'>
    <div className='flex justify-center items-center'>
      <img src={logo} alt='' className='mt-2' />
     
    </div>
    
    <div className='flex justify-center items-center mt-4 lg:mt-0'>
      <ul className='flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8 text-gray_color text-base cursor-pointer' style={{ listStyleType: "none" }}>
        <li>
          <Link className='text-primary' to="Intro" spy={true} smooth={true}>
            Home
          </Link>
        </li>
        <li>
          <Link to="Product" spy={true} smooth={true}>
            Product
          </Link>
        </li>
        <li>
          <Link to="Features" spy={true} smooth={true}>
            Features
          </Link>
        </li>
        <li>
          <Link to="Why CRMchatbot" spy={true} smooth={true}>
            Why CRMchatbot
          </Link>
        </li>
        <li>
          <Link to="Plans" spy={true} smooth={true}>
            Plans
          </Link>
        </li>
      </ul>
    </div>
    
   {!authTokens ?
   
   <div className='flex justify-center items-center mt-4 lg:mt-0 gap-5'>
      <Link1 className='cursor-pointer' to="/login">
        Login
      </Link1>
      <div className='bg-primary py-1 px-4 md:px-5 text-white rounded-3xl w-max'>
        <Link1 className='cursor-pointer' to='/signUp'>
          Sign Up
        </Link1>
      </div>
    </div> 
    :
    <div className=' flex justify-end  cursor-pointer '
        
        >
          <Link1 to='/dashboard'>
          <div className='flex  
                bg-primary

            rounded-3xl w-max px-6 py-2 text-white items-center justify-center gap-1'
           
            >
                <BsFillPersonFill/>
                {user?.username}
            </div>
          </Link1>
            
        </div>
    
    }



  </div>
  
  )
}

export default NavBar