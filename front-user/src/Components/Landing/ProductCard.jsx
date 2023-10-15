import React from 'react'

const ProductCard = ({image, title, description }) => {
  return (
<div className='flex gap-4 lg:justify-center'>
    <div className='w-32 h-32 lg:w-[150px] lg:h-[150px] '>
      <img src={image} alt='' className='w-full h-full' />
    </div>
    <div className='flex flex-col text-lg lg:text-lg gap-2 text-primary'>
      <p className='font-semibold text-lg'>{title}</p>
      <p className='text-gray_color'>{description}</p>
    </div>
  </div>  )
}

export default ProductCard


/*
                <div className='flex gap-4 justify-center '>
                    <div className='w-[150px] h-[150px]'>
                        <img src={product_icon1}  alt=''/>
                    </div>
                    <div className='flex flex-col text-lg gap-2  text-primary'>
                        <p className=' font-semibold '>Centralized Social Media Conversations:</p>
                        <p className='text-gray_color'>Streamline your social media communication by consolidating conversations from various platforms into a single dashboard.</p>
                    </div>
              
*/