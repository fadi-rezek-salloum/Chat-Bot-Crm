import React from 'react'
import backround_leftcontent from '../../Assets/backround_leftcontent.svg'
import logo from '../../Assets/logo_chatbot_white.svg'
import { useNavigate } from "react-router-dom";

const LeftContent = () => {
  const history = useNavigate();

  return (
    <div className="w-full h-full flex justify-center items-center">
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${backround_leftcontent})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-[70%] h-full mx-auto my-auto">
        <div className="flex flex-col justify-center w-full h-full">
          <img
            src={logo}
            alt=""
            className="w-[70%] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl cursor-pointer "
            onClick={()=>{          history('/');
          }}
          />
          <div className="text-white text-lg ">
            Unleash the power of our CRM chatbot platform to elevate your social media game and create thrilling connections like never before!
          </div>

          <div className=" cursor-pointer w-max bg-secondary py-2 px-6 text-white rounded-3xl mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12"
            onClick={()=>{          history('/');
          }}
          >
            Go back to Landing Page
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LeftContent


