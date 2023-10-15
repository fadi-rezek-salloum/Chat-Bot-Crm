import React from 'react'
import feature_1 from '../../Assets/feature_1.svg'
import feature_2 from '../../Assets/feature_2.svg'

import feature_3 from '../../Assets/feature_3.svg'

import Feature from './Feature'

const Features = () => {
  return (
    <div className='py-32' id='Features'>
      <div className='flex flex-col lg:flex-row justify-between items-center'>
        <div className='lg:flex lg:justify-between lg:w-full text-center lg:text-left'>
          <p className='text-2xl lg:text-3xl text-primary font-semibold'>Our Features</p>
          <p className='mt-2 text-center text-sm text-primary'>Elevate Your Social Engagement: Introducing Our CRM <br/>Chatbot Platform with Agent Collaboration!</p>

          <div className='mt-4 bg-primary py-2 px-7 text-white rounded-3xl inline-block'>Get Started</div>
        </div>
      </div>
      
      
      <div className='flex flex-col md:flex-row gap-6 mt-8 md:mt-12'>
        <Feature image={feature_1} title="Agent Collaboration" description="Simplify communication and enhance teamwork with our Unified Inbox featuring"/>
        <Feature image={feature_2} title="Dynamic Response" description="Forge authentic connections with Dynamic Response Personalization."/>
        <Feature image={feature_3} title="Daily Analytics" description="Elevate your understanding of customer emotions with Smart Sentiment Analysis."/>
      </div>
    
    </div>
  )
}

export default Features


/*
<div className='py-16' id='Features'>
        <div className='flex justify-between items-center '>
            <p className='text-[30px] text-primary font-semibold'>Our Features</p>
            <p className=' text-center text-sm text-primary'>Elevate Your Social Engagement: Introducing Our CRM <br/>Chatbot Platform with Agent Collaboration!</p>
            <div className=' bg-primary py-1 px-7 text-white rounded-3xl w-max'>Get Started</div>

        </div>


         <div className='flex flex-col md:flex-row gap-6 mt-8 md:mt-12'>
    <Feature image={feature_1} title="Agent Collaboration" description="Simplify communication and enhance teamwork with our Unified Inbox featuring"/>
    <Feature image={feature_2} title="Dynamic Response" description="Forge authentic connections with Dynamic Response Personalization."/>
    <Feature image={feature_3} title="Daily Analytics" description="Elevate your understanding of customer emotions with Smart Sentiment Analysis."/>
  </div>

    </div>
*/