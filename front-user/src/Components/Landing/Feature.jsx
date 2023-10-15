import React from 'react'

const Feature = ({image , title , description}) => {
  return (
    <div className='flex flex-col gap-5 justify-center items-center'>
    <img className='h-24 w-24 md:h-32 md:w-32' src={image} alt=''/>
    <p className='text-xl md:text-2xl text-primary font-semibold'>{title}</p>
    <p className='mt-2 text-sm text-primary text-center'>{description}</p>
  </div>
  )
}

export default Feature