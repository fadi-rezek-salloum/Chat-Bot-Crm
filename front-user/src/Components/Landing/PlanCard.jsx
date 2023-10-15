import React,{useContext} from 'react'

import {AiFillCheckCircle , AiFillCloseCircle} from 'react-icons/ai';
import ellipse from '../../Assets/Ellipse.svg'
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import {  toast } from 'react-toastify';


const PlanCard = ({ plan, amount, unit, features, isHighlighted , isPayment,textBtn , PeriodChooseUser , setShowPopup ,isLandingPage}) => {
  const navigate = useNavigate();
 
  let baseUrl = process.env.REACT_APP_PAYMENTS_URL
  const {authTokens} = useContext(AuthContext)


  const payment = async (period ) => {
    setShowPopup(true)
      try {  
        const response = await axios.post(`${baseUrl}payment?period=${period}&plan_id=${plan.id}`, 
        {
   
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
      //   props.setShowPopup(false)
        console.log(response)

        if (response.status === 200) {
          
          window.location.href = response.data.redirect_url;
          setShowPopup(false)

          }
      } catch (error) {
      
          console.log(error)
          setShowPopup(false)
          toast.error('An error occurred, please retry.')

          
  
     
        
      }
   
  
    }



  function doesItemExist( itemToFind) {
    return  plan.features.some(
      (item) => item.id === itemToFind.id
      );
  }
  return (
    <div className={` flex flex-col gap-3  items-center w-full${isHighlighted ? ' bg-primary pt-10 pb-20' : ' bg-white pt-7 pb-14 '} rounded-3xl shadow-xl h-max relative`}>
    <p className={`font-semibold ${isHighlighted ? 'text-2xl' : 'text-base'} ${isHighlighted ? 'text-white' : 'text-primary'}`}>{plan?.name}</p>
    <div className='flex'>
      <p className={`font-semibold text-4xl text-${isHighlighted ? 'white' : 'primary'}`}>
        {amount}
        <span className={`text-gray_color text-xs h-full ${isHighlighted ? 'text-white' : ''}`}>{unit}</span> </p>
    
    </div>
    <div className={`${isHighlighted ? 'bg-white  mt-10'  : 'bg-[#F8FAFA] mt-7'}  w-[90%] px-3 py-5 ${isHighlighted ? 'text-lg font-medium text-primary' : ''} rounded-xl flex flex-col gap-3`}>
      {features.map((feature, index) => (
        <div key={index} className={`flex  text-primary  gap-3 items-center  text-sm font-medium`}>
          {
            doesItemExist(feature) ? 
            <AiFillCheckCircle className='text-xl sm:text-2xl w-[10%]' />
  
           : 
           <AiFillCloseCircle className='text-xl sm:text-2xl  w-[10%]' />
           }
          {feature.name}
        </div>
      ))}
      <div className={`bg-${isHighlighted ? 'primary' : 'white'} 
      shadow-lg px-5 py-3 mt-2 font-medium text-sm cursor-pointer
       mx-auto text-center text-${isHighlighted ? 'white' : 'primary'} rounded-3xl
       ${isPayment ?'w-full border border-primary':'w-[70%]'} 
       
       `}
       onClick={()=>{
        if(isLandingPage){
          navigate("/login")
        }else{
          if(PeriodChooseUser === "Bil Monthly"){
            payment(30)
          }else if(PeriodChooseUser === "Bil Quarterly"){
            payment(120)
          } else{
            payment(365)
          }
         
        }

     

       }}

       >
        {
          
        }
        {textBtn}
      </div>
    </div>
    {/* {isHighlighted && <img src={ellipse} alt='' className='absolute bottom-0  w-full h-[75%] opacity-70 rounded-b-[25px]' />} */}
  </div>
  )
}

export default PlanCard
