import React from 'react'
import logo from '../../Assets/logo_chatbot_white.svg'

const Footer = () => {
  return (
    <div className='py-6 md:py-10 px-4 md:px-10  w-full  font-inter flex flex-col bg-primary h-[auto]'>
      <div className=' w-full  font-inter
    flex flex-col md:flex-row gap-20 justify-center items-center '>
    <div className='md:w-[45%] '>
      <div className='flex items-center text-white text-xl md:text-2xl font-bold'>
        <img src={logo} alt=''  />
      </div>
      <p className='text-sm md:text-base text-gray_color mt-2 md:mt-3'>
        Experience the future of customer engagement with our CRM Chatbot Platform.
         Seamlessly integrating multiple social media channels into a unified dashboard, 
         our platform empowers businesses to manage interactions effortlessly. 
         From AI-powered sentiment analysis to dynamic response personalization,
          we provide the tools to understand customer emotions and deliver personalized
           interactions at scale.
      </p>
    </div>
   <div className='md:w-[50%] w-full flex text-sm md:text-base text-gray_color'>
   <div className='w-full md:w-1/3'>
      <div className='flex flex-col gap-3'>
        <p className=' text-white'>Support</p>
        <p className='mt-2 md:mt-3 text-base '>Help center</p>
        <p className=''>Account information</p>
        <p className=''>About</p>
        <p className=''>Contact us</p>
      </div>
    </div>
    <div className='w-full md:w-1/3'>
      <div className='flex flex-col gap-3'>
        <p className=' text-white'>Product</p>
        <p className='mt-2 md:mt-3'>Update</p>
        <p className=''>Security</p>
        <p className=''>Pricing product</p>
      </div>
    </div>
    <div className='w-full md:w-1/3'>
      <div className='flex flex-col gap-3'>
      <p className=' text-white'>Legal</p>
        <p className='mt-2 md:mt-3 '>Terms & Conditions</p>
        <p className=' '>Privacy policy</p>
      </div>
    </div>
   </div>


  </div>

  <div className='text-gray_color text-sm mt-10 text-center'>
    © 2023 CRMchatbot. Copyright and rights reserved
  </div>
    </div>
  )
}

export default Footer