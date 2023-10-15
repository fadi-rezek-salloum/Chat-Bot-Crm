import React from 'react'

const LogoCard = ({ image, name }) => {
  return (
<div className='flex  justify-center items-center gap-4'>
    <img src={image} alt={name} className='w-5 h-5 md:w-7 md:h-7' />
    <p>{name}</p>
  </div>  )
}

export default LogoCard