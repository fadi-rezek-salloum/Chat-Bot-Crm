import React,{useContext , useState , useEffect} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useStateContext} from "../contexts/ContextProvider";

import TopBar from '../components/Layout/TopBar';
import Owner from '../components/Owner/Owner';
import Plans from '../components/Plans/Plans';
import PopUp_editPlan from '../components/Plans/PopUp_editPlan';
import axios from 'axios';

const PlansPage = () => {
    const {authTokens} = useContext(AuthContext)
    const [showPopup, setShowPopup] = useState(false);
    const [indexPlan, setIndexPlan] = useState(0);
    const [change, setChange] = useState(false);


    let baseUrl=process.env.REACT_APP_PAYMENTS_URL
    let url_GET_PLANS=`${baseUrl}plans`
    let url_GET_Features=`${baseUrl}features`
    
    const [features, setFeatures] = useState([]);
    const [plans, setPlans] = useState([]);
  
    useEffect(() => {
      getPlans();
      getFeatures()
    }, [change]);
  
  const getPlans = async () => {
  try {
  
    const response = await axios.get(url_GET_PLANS, 
   
    {
      headers: {
        Authorization: `Bearer ${authTokens}`
      }
    }
    );
    if (response.status === 200) {
      setPlans(response.data.plans)
   
  
    }
  } catch (error) {
  
  
  }
  
  }
  
  const getFeatures = async () => {
    try {
    
      const response = await axios.get(url_GET_Features, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
    
    
      if (response.status === 200) {
        // Sign-up successful
        setFeatures(
         
          response.data.features
          )
    
        // Redirect or show success message
      }
    } catch (error) {
    
    
    
    
      
    }
    // setIsLoading(false); // Stop loading indicator
    
    }




  return (
    <div className='w-full h-full flex flex-col'>
          { authTokens && <TopBar
          title = "Plans"
          description = "Manage your plans"
          isSearch = {false}
          /> }
      
      <Plans 
        setShowPopup={setShowPopup}
        plans={plans}
        features={features}
        setIndexPlan = {setIndexPlan}

      />
             {showPopup && (
        <div className=" fixed left-0 top-0 w-[100%] 
         h-screen bg-black 
         bg-opacity-60 backdrop-blur-[1px] 
         z-[9999] flex justify-center items-center  ">
         

         <PopUp_editPlan
                setShowPopup={setShowPopup}
                plans={plans}
                setPlans={setPlans}
                features={features}
                setFeatures = {setFeatures}
                indexPlan = {indexPlan}
                change= {change}
                setChange={setChange}
                />
        </div>
      )}
    
   </div>
  )
}

export default PlansPage