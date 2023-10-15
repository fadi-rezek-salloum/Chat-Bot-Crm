import React from 'react'
import {AiFillCheckCircle} from 'react-icons/ai';
import whyImage from '../../Assets/whyImage.svg'

const WhyCRMchatbot = () => {
  return (
    <div className='flex flex-col-reverse md:flex-row justify-between py-10 md:py-28' id='Why CRMchatbot'>
    <div className='flex flex-col justify-start w-full md:w-1/2 gap-4'>
      <p className='font-bold text-xl md:text-4xl xl:text-5xl text-primary'>
        What Benefit Will You Get
      </p>
      <div className='flex items-center text-primary text-base md:text-lg gap-4 mt-2 md:mt-5'>
        <AiFillCheckCircle className='h-6 w-6' />
        Enhanced Efficiency and Productivity
      </div>
      <div className='flex items-center text-primary text-base md:text-lg gap-4'>
        <AiFillCheckCircle className='h-6 w-6' />
        Deeper Customer Understanding
      </div>
      <div className='flex items-center text-primary text-base md:text-lg gap-4'>
        <AiFillCheckCircle className='h-6 w-6' />
        Consistent Brand Voice
      </div>
      <div className='flex items-center text-primary text-base md:text-lg gap-4'>
        <AiFillCheckCircle className='h-6 w-6' />
        Increased Customer Satisfaction
      </div>
      <div className='flex items-center text-primary text-base md:text-lg gap-4'>
        <AiFillCheckCircle className='h-6 w-6' />
        Optimized Team Collaboration
      </div>
    </div>
    <div className='mb-6 md:mb-0'>
      <img src={whyImage} alt='' className='w-full md:w-[400px] lg:w-[500px] xl:w-[600px]' />
    </div>
  </div>
  
  
  )
}

export default WhyCRMchatbot