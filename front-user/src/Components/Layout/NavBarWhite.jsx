import React from 'react'
import logo from '../../Assets/logoaa.svg'
import { Link } from "react-scroll";
import { Link as Link1 } from "react-router-dom";
import {BsFillPersonFill} from 'react-icons/bs'

const NavBarWhite = () => {
  return (
    <div className='w-full flex flex-col bg-white px-10 py-4 shadow-[0_5px_5px_0px_rgba(0,0,0,0.1)] lg:flex-row justify-between items-center font-inter'>
    <div className='flex justify-center items-center'>
      <img src={logo} alt='' className=' '/>
      {/* <p className='text-primary text-xl lg:text-2xl font-bold ml-2'>
        <span>CRM</span>chatbot</p> */}
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
    
    
     

      <div className=' flex justify-end  cursor-pointer '
        
        >
            <div className='flex  
                bg-primary

            rounded-3xl w-max px-6 py-2 text-white items-center justify-center gap-1'>
                <BsFillPersonFill/>
                cherrab karim
            </div>
        </div>
  
  </div>
  )
}

export default NavBarWhite