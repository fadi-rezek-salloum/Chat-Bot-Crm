import React,{useEffect , useContext} from 'react'
import io from 'socket.io-client';
import AuthContext from "../contexts/AuthContext";
import Dashboard from '../components/Dashboard/Dashboard';
import TopBar from '../components/Layout/TopBar';

const DashboardPage = () => {
  const {authTokens} = useContext(AuthContext)



  return (


        <div className='w-full h-full flex flex-col'>
        { authTokens && <TopBar
        title = "Dashboard"
        description = "See your social stats come alive!"
        isSearch = {false}
        className="z-10"
        /> }
        <Dashboard/>


        </div>
  )
}

export default DashboardPage