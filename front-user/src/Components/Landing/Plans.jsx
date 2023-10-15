import React,{useState , useEffect} from 'react'
import {AiFillCheckCircle} from 'react-icons/ai';
import ellipse from '../../Assets/Ellipse.svg'
import PlanCard from './PlanCard';
import axios from 'axios';
import PopUp_waitingPayment from './PopUp_waitingPayment';
import Loader from '../Loader';


const PlanButton = ({ title, isActive, onClick }) => (
    <div
      className={`px-7 py-3 cursor-pointer ${isActive ? 'bg-primary text-white rounded-full' : ''}`}
      onClick={onClick}
    >
      {title}
    </div>
  );

const Plans = ({isLandingPage}) => {
  const [showPopup,setShowPopup]=useState(false)
  const [loadingPlans,setLoadingPlans]=useState(false)
  const [loadingFeatures,setLoadingFeatures]=useState(false)


    const [plan, setPlan] = useState("Bil Monthly");
        const handleClick = (newPlan ) => {
        setPlan(newPlan);
        console.log(newPlan)
        if(newPlan === "Bil Monthly"){
          setPrices({
            planOne : plans[0].monthly_price ,
            planTwo : plans[1].monthly_price  ,
            planThree :plans[2].monthly_price  ,
          })
        }else if(newPlan === "Bil Quarterly"){
          setPrices({
            planOne : plans[0].quarterly_price ,
            planTwo : plans[1].quarterly_price  ,
            planThree :plans[2].quarterly_price  ,
          })
        } else{
          setPrices({
            planOne : plans[0].yearly_price ,
            planTwo : plans[1].yearly_price  ,
            planThree :plans[2].yearly_price  ,
          })
        }
       
      };

 
        let baseUrl=process.env.REACT_APP_PAYMENTS_URL
        let url_GET_PLANS=`${baseUrl}plans`
        let url_GET_Features=`${baseUrl}features`
        
        const [features, setFeatures] = useState([]);
        const [plans, setPlans] = useState([
          {
            
          },
          {
            
          },
          {
            
          },
        ]);
        const [prices, setPrices] = useState({
            planOne   : 0   ,
            planTwo   : 0   ,
            planThree : 0   ,
        });
        
        useEffect(() => {
          getFeatures()
          getPlans();
      
        }, []);
      
      const getPlans = async () => {
        setLoadingPlans(true)
      try {
      
        const response = await axios.get(url_GET_PLANS, 
       
       
        );

        if (response.status === 200) {
          setPlans(response.data.plans)
          setPrices({
            planOne : response.data.plans[0].monthly_price ,
            planTwo : response.data.plans[1].monthly_price  ,
            planThree : response.data.plans[2].monthly_price  ,
          })
      
        }
      } catch (error) {
      
      
      }
      setLoadingPlans(false)
      }
      
      const getFeatures = async () => {
        setLoadingFeatures(true)

        try {
        
          const response = await axios.get(url_GET_Features);
        
        
          if (response.status === 200) {
            // Sign-up successful

            setFeatures(
             
              response.data.features
              )
        
            // Redirect or show success message
          }
        } catch (error) {
        
        
        
        
          
        }
        setLoadingFeatures(false)
        
        }
    
    



  return (
    <div className={`${isLandingPage ? 'py-20' : 'py-0'} px-10`} id='Plans'>
  
    {
      ! loadingFeatures && !loadingPlans ? 
      <div className='sm:mt-0 mt-24 flex flex-col justify-center items-center gap-4'>
        {/* <p >Choose Plan That's Right For You</p> */}
      <div className='bg-white shadow-xl sm:flex sm:flex-row flex-col  gap-6
       sm:py-1 sm:px-1 px-4 py-2 text-lg text-primary  rounded-[30px] sm:rounded-full'>
        <PlanButton title="Bil Monthly" isActive={plan === "Bil Monthly"} onClick={() => handleClick("Bil Monthly" )} />
        <PlanButton title="Bil Quarterly" isActive={plan === "Bil Quarterly"} onClick={() => handleClick("Bil Quarterly")} />
        <PlanButton title="Bil Yearly" isActive={plan === "Bil Yearly"} onClick={() => handleClick("Bil Yearly")} />
      </div>
    
      <div className='lg:w-[90%] md:w-[100%] ssm:w-[50%] ss:w-[60%]  w-[100%]  flex flex-col md:flex-row gap-6 mt-8 justify-center items-center '>
        <PlanCard plan={plans[0]} 
        amount={prices.planOne} unit="EUR" features={features}
         textBtn="Subscribe" PeriodChooseUser={plan} setShowPopup={setShowPopup} isLandingPage={isLandingPage} />
        <PlanCard plan={plans[1]} amount={prices.planTwo} unit="EUR" features={features} isHighlighted={true}  textBtn="Subscribe" PeriodChooseUser={plan} setShowPopup={setShowPopup} isLandingPage={isLandingPage}/>
        <PlanCard plan={plans[2]}  amount={prices.planThree} unit="EUR" features={features} textBtn="Subscribe" PeriodChooseUser={plan} setShowPopup={setShowPopup} isLandingPage={isLandingPage} />
      </div>
      </div>
      
      : 
      
      <div className=' w-full h-[450px] flex  justify-center items-center '>
      <Loader/>
      </div>
    }



   
    {
          showPopup && 
          <div className=" fixed left-0 top-0 w-[100%] 
          h-screen bg-black 
          bg-opacity-60 backdrop-blur-[1px] 
          z-[9999] flex justify-center items-center  ">

                  <PopUp_waitingPayment setShowPopup = {setShowPopup}/>

          </div>
          
          
        }




  </div>
  )
}

export default Plans