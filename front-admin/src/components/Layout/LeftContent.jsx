import React from 'react'
import backround_leftcontent from '../../assets/backround_leftcontent.svg'
import logo from '../../assets/admin_image.svg'

const LeftContent = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${backround_leftcontent})`,
        backgroundSize: 'cover', // Adjust background size
      }}
    >
      <div className="max-w-screen-xl h-full mx-auto">
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={logo}
            alt=""
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
          />
        </div>
      </div>
    </div>
  </div>
  
  );
  
}

export default LeftContent