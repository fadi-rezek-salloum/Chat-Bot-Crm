import React,{useContext} from 'react'
import TopBar from '../Components/Layout/TopBar'
import AuthContext from "../contexts/AuthContext";
import Dashboard from '../Components/Dashboard/Dashboard';

const DashboardPage = () => {
    const {authTokens} = useContext(AuthContext)

  return (
    <div className='w-full h-full flex flex-col'>
          { authTokens && <TopBar
          title = "Dashboard"
          description = "Manage your agents"
          isSearch = {false}
          className="z-10"
          /> }
      <Dashboard 
        

         className="z-20  "
      />  
        </div> )
}

export default DashboardPage