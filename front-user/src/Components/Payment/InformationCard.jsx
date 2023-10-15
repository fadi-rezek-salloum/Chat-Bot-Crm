import React, { useEffect  , useContext } from 'react';
import AuthContext from "../../contexts/AuthContext";
import axios from 'axios';

const InformationCard = () => {
  const {user , authTokens} = useContext(AuthContext)


  let baseUrl=process.env.REACT_APP_PAYMENTS_URL
  const url_post_payment = `${baseUrl}webhook/clickpay/${user.id}`
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://secure.clickpay.com.sa/payment/js/paylib.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const headers = {
        Authorization: `Bearer ${authTokens}`
        // Add any other headers you need here
      };

      const response = await axios.post(url_post_payment, formData, { headers });

      console.log('Form Submission Response:', response.data);
      document.getElementById('paymentErrors').innerHTML = '';

      if (response.data.error) {
        // Handle errors here
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  useEffect(() => {
    if (window.paylib) {
      try {
        const myform = document.getElementById('payform');
        alert("ll")


        
        window.paylib.inlineForm({
          key: 'CNKMDH-VHV66H-MG6TRN-M97BTP', // Replace with your client key
          form: myform,
          autoSubmit: true,
          callback: function (response) {
            console.log('ClickPay Response:', response);
            document.getElementById('paymentErrors').innerHTML = '';
            alert("error")
            if (response.error) {
              window.paylib.handleError(document.getElementById('paymentErrors'), response);
            }
          }
        });


        
      } catch (error) {
        console.error('Error in paylib.inlineForm:', error);
      }
     
    }
  }, []);


  

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
    <form  onSubmit={handleFormSubmit} id="payform" method="post">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Card Number</label>
        <input
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-primary focus:outline-none"
          type="text"
          data-paylib="number"
          size="20"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Expiry Date (MM/YYYY)</label>
        <div className="flex space-x-2">
          <input
            className="mt-1 block w-1/2 px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-primary focus:outline-none"
            type="text"
            data-paylib="expmonth"
            size="2"
          />
          <input
            className="mt-1 block w-1/2 px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-primary focus:outline-none"
            type="text"
            data-paylib="expyear"
            size="4"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Security Code</label>
        <input
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-primary focus:outline-none"
          type="text"
          data-paylib="cvv"
          size="4"
        />
      </div>
      <div id="paymentErrors" className="text-red-500 mb-4"></div>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-primary"
      >
        Place Order
      </button>
    </form>
  </div>

  )
}

export default InformationCard