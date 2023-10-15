import React,{useContext} from 'react'
import Settings from '../Components/Settings'
import TopBar from '../Components/Layout/TopBar'
import AuthContext from "../contexts/AuthContext";

const SettingsPage = () => {
  const {authTokens} = useContext(AuthContext)

  return (
  

      <div className='w-full h-full flex flex-col'>
          { authTokens && <TopBar
          title = "Settings"
          description = "Manage your personal account"
          isSearch = {false}
          className="z-10"
       
          /> }
          <Settings 

className="z-20  "
          />

      </div>
        )
}

export default SettingsPage