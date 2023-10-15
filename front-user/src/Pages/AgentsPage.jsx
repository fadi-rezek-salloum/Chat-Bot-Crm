import React,{useContext , useState , useEffect} from 'react'
import AuthContext from "../contexts/AuthContext";
import TopBar from '../Components/Layout/TopBar'
import Agents from '../Components/Agents/Agents'
import axios from 'axios';

const AgentsPage = () => {
  let baseUrl=process.env.REACT_APP_DEPARTMENTS_URL
  let url_GET_AGENTS=`${baseUrl}agents/`
   const {authTokens} = useContext(AuthContext)
   
   const [agents, setAgents] = useState([]);
   const [filtered, setFiltered] = useState(agents);
 
 
   useEffect(() => {
    getAgents();
   }, []);
 
 const getAgents = async () => {
 try {
 
   const response = await axios.get(url_GET_AGENTS, 
  
   {
     headers: {
       Authorization: `Bearer ${authTokens}`
     }
   }
   );
 
   if (response.status === 200) {
     // Sign-up successful

     setAgents(response.data.agents)
     setFiltered(response.data.agents)
     // Redirect or show success message
   }
 } catch (error) {
 
     console.log(error)
 
 
 
   
 }
 
 }

  return (
       <div className='w-full h-full flex flex-col'>
          { authTokens && <TopBar
          title = "Agents"
          description = "Manage your agents"
          isSearch = {true}
          placeholderShearch = "Search agents"
          list = {agents}
          setFiltered = {setFiltered}
          className="z-10"
          /> }
      <Agents 
         agents={filtered}
         setAgents = {setFiltered}
         setAgentsorignal = {setAgents}

         className="z-20  "
      />
    
   </div>
  
  )
}

export default AgentsPage


