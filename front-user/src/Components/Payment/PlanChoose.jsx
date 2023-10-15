import React , {useState , useEffect} from 'react'
import PlanCard from '../Landing/PlanCard'
import axios from 'axios';

const PlanChoose = ({id , PeriodChooseUser}) => {
  let baseUrl=process.env.REACT_APP_PAYMENTS_URL

  const [price, setPrice] = useState(0);



  const [plan, setPlan] = useState({});
  const [features, setFeatures] = useState([]);
  let url_GET_Features=`${baseUrl}features`

  const getPlan = async () => {
    try {
    
      const response = await axios.get(`${baseUrl}plans/${id}`, 
     
     
      );
      console.log(response)

      if (response.status === 200) {
        setPlan(response.data.plan)
        setPrice( PeriodChooseUser === "Bil Monthly" ?
        response.data.plan.monthly_price  : 
        PeriodChooseUser ==="Bil Quarterly" ?
        response.data.plan.quarterly_price : 
        response.data.plan.yearly_price
        )
      }
    } catch (error) {
    
        console.log(error)
    
    }
    
    }

  const getFeatures = async () => {
      try {
      
        const response = await axios.get(url_GET_Features);
      
        console.log(response.data.features)
      
        if (response.status === 200) {
          // Sign-up successful

          setFeatures(
           
            response.data.features
            )
      
          // Redirect or show success message
        }
      } catch (error) {
      
          console.log(error)

        
      }
      // setIsLoading(false); // Stop loading indicator
      
      }
    useEffect(() => {
      getPlan();
      getFeatures()
    }, []);
  return (
    <div className='w-full bg-[#F9FAFA] h-full border'>
           <div className='w-[50%] mx-auto flex justify-center items-center h-full'>
           <PlanCard 
           plan={plan}
           title={plan.name}
           amount={price}
           unit="DA"
           isPayment={true}
           textBtn={PeriodChooseUser}
           features={features} 
                      
                      
                      />
            
           </div>

    </div>
  )
}

export default PlanChoose