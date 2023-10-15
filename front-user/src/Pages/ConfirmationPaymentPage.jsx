import React from 'react'
import NavBarWhite from '../Components/Layout/NavBarWhite'
import Footer from '../Components/Landing/Footer'
import ConfirmationPayment from '../Components/Payment/ConfirmationPayment'

const ConfirmationPaymentPage = () => {
  return (
    <div className='w-full '>
    <NavBarWhite/>
    
    <ConfirmationPayment/>
    <Footer/>
</div>
  )
}

export default ConfirmationPaymentPage