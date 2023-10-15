import React,{useContext} from 'react'
import NavBarWhite from '../Components/Layout/NavBarWhite'
import InformationCard from '../Components/Payment/InformationCard'
import Footer from '../Components/Landing/Footer'
import PlanChoose from '../Components/Payment/PlanChoose'
import { useParams } from 'react-router-dom';
import TopBar from '../Components/Layout/TopBar'
import AuthContext from "../contexts/AuthContext";
import { useLocation } from 'react-router-dom';

const PaymentPlanPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const {authTokens} = useContext(AuthContext)
  const plan = location.state && location.state.PeriodChooseUser;

  return (
    <div className='w-full h-full flex flex-col'>
    { authTokens && <TopBar
    title = {plan}
    description = "Manage your personal account"
    isSearch = {false}
 
    className="z-10"
    /> }
    <div className='w-full'> 
    
      
    <div className='w-full flex py-16 h-full  '>
      
        <div className="w-[45%]">
          <InformationCard />

        </div>
        <div className="w-[55%]">
          <PlanChoose  id ={id} PeriodChooseUser={plan}/>

        </div>
      
    </div>
 
</div>

</div>
    
  )
}

export default PaymentPlanPage