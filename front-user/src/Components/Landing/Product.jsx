import React from 'react'
import product_icon1 from '../../Assets/product_icon.svg'
import ProductCard from './ProductCard'

const Product = () => {
  return (
    <div className='flex flex-col lg:flex-row py-24 gap-8 bg-white font-inter' id="Product">
    <div className='flex flex-col h-full  text-primary gap-8 lg:w-[60%]'>
      <p className='font-bold text-2xl lg:text-5xl w-[80%]'>Revolutionize Social Engagement with Our CRM Chatbot Platform!</p>
      <p className='text-lg'>Unlock the future of social media management with our cutting-edge CRM chatbot platform! </p>
      <p className='text-base'>Experience the synergy of streamlined interactions, emotional intelligence, and hyper-personalization. Elevate your social media game with our CRM chatbot platform and transform how you engage, understand, and delight your audience. The future of social engagement starts now!</p>
    </div>
    <div className='flex flex-col gap-2 lg:w-[40%] '>
      <ProductCard image={product_icon1} title="Centralized Social Media Conversations:" description="Streamline your social media communication by consolidating conversations from various platforms into a single dashboard." />
      <ProductCard image={product_icon1} title="Centralized Social Media Conversations:" description="Streamline your social media communication by consolidating conversations from various platforms into a single dashboard." />
      <ProductCard image={product_icon1} title="Centralized Social Media Conversations:" description="Streamline your social media communication by consolidating conversations from various platforms into a single dashboard." />
    </div>
  </div>
  
  )
}

export default Product