import React,{useEffect , useContext , useState} from 'react'
import PlanCard from './PlanCard'
import AuthContext from "../../contexts/AuthContext";

const Plans = ({setShowPopup , plans , features , setIndexPlan}) => {

  const {authTokens} = useContext(AuthContext)


  return (
    <div className='w-full h-full'>
      {
      plans.length !== 0 ? 

      <div className='flex flex-wrap animate-slideup gap-7 px-5 sm:px-10 py-6 w-full  justify-center items-center'>
     
      
      <div className='w-[90%] sm:w-1/2 md:w-[50%] lg:w-[31%]'>
        <PlanCard setShowPopup={setShowPopup}
                  plan={plans}
                  features={features}
                  setIndexPlan = {setIndexPlan}
                  index = {0}
        />
      </div>
      <div className='w-[90%] sm:w-1/2 md:w-[50%] lg:w-[31%]'>
        <PlanCard setShowPopup={setShowPopup}
                          plan={plans}
                          features={features}
                          setIndexPlan = {setIndexPlan}
                          index = {1}

        />
      </div>
      <div className='w-[90%] sm:w-1/2 md:w-[50%] lg:w-[31%]'>
        <PlanCard setShowPopup={setShowPopup} 
                                  plan={plans}
                                  features={features}
                                  setIndexPlan = {setIndexPlan}
                                  index = {2}

        />
      </div>
</div> :
<div></div>
    }
    </div>
   
  )
}

export default Plans