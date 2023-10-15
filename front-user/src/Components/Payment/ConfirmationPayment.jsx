import React from 'react'
import Success from '../../Assets/Success.svg'

const ConfirmationPayment = () => {
  return (
    <div className='text-primary w-full flex justify-center items-center px-24 py-24 pb-32 font-inter  '>
        <div className='w-[45%]  flex flex-col items-center justify-center gap-5'>
          <img src={Success} alt=''/>
          <p className=' font-medium text-2xl mt-5'>Operation of payment was Confirmed</p>
          <p className=' text-base'>Now you can use your platform</p>
          <button className="bg-primary mt-5  py-2.5 px-6 text-sm font-bold text-white rounded-3xl w-full">
          Go to dahsboard
          </button>
        </div>
    </div>
  )
}

export default ConfirmationPayment