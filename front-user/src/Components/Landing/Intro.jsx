import React from 'react'
import intro_image from '../../Assets/intro_image.svg'
import unsplash from '../../Assets/unsplash.svg'
import { Link  } from "react-router-dom";

import {AiOutlinePlayCircle} from 'react-icons/ai'
import LogoCard from './LogoCard'
const Intro = () => {
  return (
    

    <div className='flex flex-col gap-10 pb-24 pt-14' id="Intro">
    <div className='flex flex-col md:flex-row justify-between mt-16'>
      <div className='flex flex-col text-center md:text-left text-primary gap-8'>
        <p className='font-bold text-2xl md:text-4xl lg:text-5xl'>We're here to Increase<br/> your Productivity</p>
        <p className='text-base'>Transform Your Social Media Conversations with CRMchatbot</p>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='bg-primary py-3 px-5 text-white rounded-3xl w-max cursor-pointer'
          
          >
          <Link className='cursor-pointer' to="/signup">
          Try free trial
      </Link>
          </div>
          <div className='flex h-full justify-center items-center gap-4 cursor-pointer'>
            <AiOutlinePlayCircle className='h-8 w-8'/>
            View Demo
          </div>
        </div>
      </div>
      <div className='mt-6 md:mt-0 flex  justify-center items-center'>
        <img src={intro_image} className='w-full  sm:w-[420px] ss:w-[360px]' alt=''/>
      </div>
    </div>
    <div className='flex flex-col gap-12 md:justify-center md:items-center w-full'>
  <p className='font-bold text-xl md:text-2xl text-primary text-center'>More than 25,000 teams use Collabs</p>
  <div className='flex flex-wrap justify-between items-center text-base md:text-xl font-semibold text-gray_color gap-8 w-[100%] mx-auto'>
    {/* Repeat this block for each logo */}
    <LogoCard image={unsplash} name="Unsplash" />
    <LogoCard image={unsplash} name="Notion" />
    <LogoCard image={unsplash} name="INTERCOM" />
    <LogoCard image={unsplash} name="Descript" />
    <LogoCard image={unsplash} name="Grammarly" />
    <LogoCard image={unsplash} name="Unsplash" />
  </div>
</div>
  </div>
  )
}

export default Intro
