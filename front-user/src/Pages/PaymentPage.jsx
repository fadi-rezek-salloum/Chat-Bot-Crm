
import Payment from '../Components/PaymentC'

import React,{useContext , useState , useEffect} from 'react'
import AuthContext from "../contexts/AuthContext";
import TopBar from '../Components/Layout/TopBar'
import axios from 'axios';

const PaymentPage = () => {
  let baseUrl=process.env.REACT_APP_PAYMENTS_URL
  let url_GET_Payments=`${baseUrl}subscriptions/`
   const {authTokens , user} = useContext(AuthContext)
   
   const [payments, setPayments] = useState([]);
   const [filtered, setFiltered] = useState(payments);
 
 
   useEffect(() => {
    // Ensure user is available before making the API request
    if (user && user.id) {
      getPayments();
    }
  }, [user]); 
 
 //API Request Get All Agent
 const getPayments = async () => {
 try {
 
   const response = await axios.get(`${url_GET_Payments}${user.id}`, 
  
   {
     headers: {
       Authorization: `Bearer ${authTokens}`
     }
   }
   );
 
   console.log(response.data)
   if (response.status === 200) {
     // Sign-up successful

     setPayments(response.data.subscriptions)
     setFiltered(response.data.subscriptions)
     // Redirect or show success message
   }
 } catch (error) {
 
     console.log(error)
 
 
 
   
 }
 
 }
  return (
 
      <div className='w-full h-full flex flex-col'>
      { authTokens && <TopBar
      title = "Payment"
      description = "See the historique of payment"
      isSearch = {true}
      placeholderShearch = "Search payment"
      list = {payments}
      setFiltered = {setFiltered}
      className="z-10"
      /> }
  <Payment 
     payments={filtered}
     setPayments = {setFiltered}
     setPaymentsorignal = {setPayments}

     className="z-20  "
  />

</div>
  )
}

export default PaymentPage