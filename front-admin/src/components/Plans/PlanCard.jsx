import React from 'react'
import {AiFillCheckCircle , AiFillCloseCircle} from 'react-icons/ai';

const PlanCard = ({setShowPopup , plan , features , setIndexPlan , index}) => {
  
  function doesItemExist( itemToFind) {
    console.log(itemToFind)
    return  plan[index].features.some(
      (item) => item.id === itemToFind.id
      // (item) =>  console.log(itemToFind.id +"//" + item.id)
      );
  }
 

  return (
    <div className='bg-white shadow-lg w-full sm:w-[100%] h-full rounded-3xl flex flex-col justify-center items-center gap-5 py-8'>
    <p className='text-2xl sm:text-3xl text-black font-medium'>{plan[index].name}</p>
    <div className={`w-full sm:w-[90%] px-3 py-5 rounded-xl flex flex-col justify-center items-center gap-5`}>
      {
     
        features.length !== 0 ?   
         <div className='w-full h-full flex flex-col gap-2'>{
          features.map((feature, index) => (
        
        
        
          <div key={index} className={`flex 
             w-[100%]
          text-primary gap-3  text-base sm:text-lg font-medium`}>
           {
            doesItemExist(feature) ? 
            <AiFillCheckCircle className='text-xl sm:text-2xl w-[10%]' />
  
           : 
           <AiFillCloseCircle className='text-xl sm:text-2xl  w-[10%]' />
           }
              {/* {feature.name} */}
              <p className='w-[90%]  break-all'>{feature.name}</p>
            
  
  
          </div>
        ))} </div>  : <div className=' text-primary text-sm'>There is no feature, then add one</div>
      }
      
      
      
    
      <div
        className={`bg-primary px-3 sm:px-5 py-3 sm:py-4 mt-4 font-medium text-base sm:text-sm mx-auto text-center text-white rounded-3xl w-full sm:w-[50%] cursor-pointer`}
        onClick={() => {setShowPopup(true)
          setIndexPlan(index)
        }
        
        
        }
      >
        Edit
      </div>
    </div>
  </div>
  )
}

export default PlanCard