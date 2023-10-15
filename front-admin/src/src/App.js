import './App.css';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import {Routes,Route} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute";

import { useContext } from "react";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute2 from "./utils/PrivateRoute2";
import { useStateContext } from "./contexts/ContextProvider";

import Sidebar from './components/Layout/Sidebar';
import NavbarMobile from './components/Layout/NavbarMobile';
import NavbarAdmin from './components/Layout/NavbarAdmin';
// import TopBar from './components/Layout/TopBar';
import OwnerPage from './pages/OwnerPage';
import PlansPage from './pages/PlansPage';
import LoginPage from "./pages/LoginPage";
import SettingsPage from './pages/SettingsPage';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationPage from './pages/NotificationPage';
import axios from 'axios';


function App() {
  const {authTokens , setShowNotifications} = useContext(AuthContext)
  const {screenSize,setScreenSize,setActiveMenu,activeMenu}=useStateContext()
  

  



  useEffect(()=>{
    const handleResize = ()=> setScreenSize(window.innerWidth)
    window.addEventListener('resize',handleResize)
    
    handleResize();
    return ()=>window.removeEventListener('resize',handleResize)
    },[])

    useEffect(()=>{
      if(screenSize <= 1140 ){
        setActiveMenu(false)
        setShowNotifications(false)
      }
      else{
        setActiveMenu(true)
      
      }
      },[screenSize])  
  return (
    <div className="relative h-screen " >

       { authTokens && !activeMenu &&    <NavbarMobile/> }
       { authTokens && activeMenu ? (
            <div className={`w-72 sidebar fixed `}>
              <Sidebar />
            </div>
          ) : (
            ""
          )}      


    <div className={` ${ authTokens && activeMenu ? "ml-72" :"" }    h-[90%]`}  >
    { false && authTokens && <div className="fixed left-0 top-0 w-[100%] h-screen bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex justify-center items-center  " >
                {/* <InfosSeller/> */}
              </div>
               
                }
    <Routes>
              <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />

                <Route exact path="/admin/owner" element={<OwnerPage />} />
                <Route path="/admin/payment/:id" element={<PaymentPage />} />

                <Route path="/admin/plans" element={<PlansPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/notification" element={<NotificationPage />} />


              </Route>
              
              <Route element={<PrivateRoute2 />} >
                <Route path="/admin/login" element={<LoginPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />

              
    </Routes> 
    </div>
    <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
         
 
  </div>
  );
}

export default App;
