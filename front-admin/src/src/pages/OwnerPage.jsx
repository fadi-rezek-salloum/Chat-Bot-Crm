import React,{useContext , useState , useEffect} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useStateContext} from "../contexts/ContextProvider";

import TopBar from '../components/Layout/TopBar';
import Owner from '../components/Owner/Owner';
import axios from 'axios';

const OwnerPage = () => {
  let baseUrl=process.env.REACT_APP_USERS_URL
  let url_GET_OWNERS=`${baseUrl}owners`


  const {authTokens} = useContext(AuthContext)
  const {activeMenu}=useStateContext()
  const [owners, setOwners] = useState([]);
  const [filtered, setFiltered] = useState(owners);


  useEffect(() => {
    getOwners();
  }, []);

//API Request Get All Agent
const getOwners = async () => {
try {

  const response = await axios.get(url_GET_OWNERS, 
 
  {
    headers: {
      Authorization: `Bearer ${authTokens}`
    }
  }
  );

  if (response.status === 200) {
    // Sign-up successful
    setOwners(response.data.owners)
    setFiltered(response.data.owners)
    // Redirect or show success message
  }
} catch (error) {

    console.log(error)



  
}

}

  return (
    <div className='w-full h-full flex flex-col'>
          { authTokens && <TopBar
          title = "Owners"
          description = "Manage your owners"
          isSearch = {true}
          placeholderShearch = "Search owners"
          list = {owners}
          setFiltered = {setFiltered}
          className="z-10"
          /> }
      <Owner 
         owners={filtered}
         setOwners = {setFiltered}
         className="z-20"
      />
    
   </div>
  )
}

export default OwnerPage