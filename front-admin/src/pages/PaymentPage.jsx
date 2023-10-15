import React , {useContext , useState , useEffect} from 'react'
import { useParams } from 'react-router-dom';
import TopBar from '../components/Layout/TopBar';
import AuthContext from "../contexts/AuthContext";
import Payment from '../components/Payment/Payment';
import axios from 'axios';

import { useLocation } from 'react-router-dom';
const PaymentPage = () => {
  let baseUrl=process.env.REACT_APP_PAYMENTS_URL
  const location = useLocation();
  const username = location.state && location.state.username;
  const { id } = useParams();


  const {authTokens} = useContext(AuthContext)
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState(payments);
  useEffect(() => {
    getPayments();
  }, []);

  const getPayments = async () => {
  
    try {
      const response = await axios.get(`${baseUrl}subscriptions/${id}`, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
      console.log(response.data.subscriptions)
    
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
    <div>
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
        </div>

        <Payment
              payments={filtered}
              setPayments = {setFiltered}
              setPaymentsorignal = {setPayments}

        />   
    </div>
  )
}

export default PaymentPage