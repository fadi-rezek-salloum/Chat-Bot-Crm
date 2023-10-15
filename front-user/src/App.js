import './App.css';
import {SignUpPage , LogInPage , ConfirmEmailPage
   , VerifiedPage  ,AgentsPage,LandingPage,PaymentPage , SettingsPage , DepartmentsPage 
   ,SocialMediaPage , PaymentPlanPage  , LinkSocialMediaPage
  } from './Routes.js'


import {Routes,Route,Outlet} from "react-router-dom"
import ProtectedRoute from "./Utils/ProtectedRoute";
import UnProtectedRoute from "./Utils/UnProtectedRoute";


import SideBar from './Components/Layout/SideBar';
import { useStateContext } from "./contexts/ContextProvider";
import { useContext , useEffect } from "react";
import AuthContext from "./contexts/AuthContext";

import axios from 'axios';
import NavbarMobile from './Components/Layout/NavbarMobile';
import ProtectedRouteSocialMedia from './Utils/ProtectedRouteSocialMedia';
import UnProtectedRouteSocialMedia from './Utils/UnProtectedRouteSocialMedia';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationPage from './Pages/NotificationPage';
import DashboardPage from './Pages/DashboardPage';
import PlansPage from './Pages/PlansPage';
import SendTokenChangePasswordPage from './Pages/SendTokenChangePasswordPage';
import ChangePasswordPage from './Pages/ChangePasswordPage';
import NotFoundPage from './Pages/NotFoundPage';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const current_url = location.pathname;

  
  const {authTokens , isPayment  , user  , here , setIsPayment  , logoutUser , setShowNotifications} = useContext(AuthContext)
  const {screenSize,setScreenSize,setActiveMenu,activeMenu}=useStateContext()


  let baseUrl=process.env.REACT_APP_USERS_URL
  let url_refresh=`${baseUrl}token/refresh`
  
    useEffect(() => {

      let hour = 1000 * 60 * 30 ;
      let interval = setInterval(() => {
        if (authTokens) {
          refreshToken();
        }
      }, hour);
      return () => clearInterval(interval);
    }, [authTokens]);

    const refreshToken = async () => {
      try {
  
       
    
  
        const response = await axios.post(url_refresh, 
        {
          "refresh":localStorage.getItem('refreshToken')
        }
        
        );
        if (response.status === 200) {
          // Sign-up successful

          localStorage.setItem('accessToken', response.data.access);
          getUser()
          // Redirect or show success message
        }
      } catch (error) {
        
        console.error('Error during sign-up:', error.response.data.message);
      
  
  
        
      }
  
    }


    useEffect(()=>{
      const handleResize = ()=> setScreenSize(window.innerWidth)
      window.addEventListener('resize',handleResize)
      
      handleResize();
      return ()=>window.removeEventListener('resize',handleResize)
      },[])
  
      useEffect(()=>{
        if( screenSize <= 1140 ){
          setActiveMenu(false)
          setShowNotifications(false)
        }
        else{
          setActiveMenu(true)
        }
        },[screenSize])   


        const getUser= async ()=>{ 

          try{
            let res  = await axios.get(`${baseUrl}owner/details`,
            {
              headers: {
                Authorization: `Bearer ${authTokens}`
              }
            }
            )
            console.log(res)
            if (res.status === 200) {
           
             
              if(((res.data.user.is_trial_active && res.data.user.is_trial_expired))  ){
                
                alert("It appears that your subscription has ended, and you do not have any active subscriptions.")
              
                setIsPayment(false)
            
                      logoutUser()
                
                
               
              }else if(!res.data.user.is_trial_active && res.data.user.is_subscription_expired){
                alert("It appears that your subscription has ended, and you do not have any active subscriptions.")
           
                setIsPayment(false) 
               
                  logoutUser()
               
                
              }
            }
      
          }
          catch(e){
          console.log(e)
           
          }
        }
        

      
  return (
    <div className="relative h-screen  " >

 {  authTokens && !activeMenu && current_url!=="/" &&   <NavbarMobile/> }
       {  authTokens && activeMenu && current_url!=="/"? (
            <div className={`w-72 sidebar fixed `}>
              <SideBar />
            </div>
          ) : (
            ""
          )}      


    <div className={` ${ authTokens && activeMenu && current_url!=="/"? "ml-72 " :"" }     h-full`}  >

   <Routes>



   

            {
              here &&  <Route element={<ProtectedRoute allowedRoles={['owner']}
              userRole={user?.role} isPayment={isPayment}  />}>
      
                        <Route exact path="/dashboard" element={<DashboardPage />} />
                        <Route exact path="/agents" element={<AgentsPage />} />
                        <Route exact path="/departments" element={<DepartmentsPage />} />
                        <Route path="/plan/:id" element={<PaymentPlanPage />} />
                        <Route exact path="/payment" element={<PaymentPage />} />

                        <Route element={<UnProtectedRouteSocialMedia   userRole={user?.role} />}>
                          <Route exact path="/link-telegram" element={<LinkSocialMediaPage typeSocialMedia="Telegram" />} />
                          <Route exact path="/link-facebook" element={<LinkSocialMediaPage typeSocialMedia="Facebook" />} />
                          <Route exact path="/link-instagram" element={<LinkSocialMediaPage typeSocialMedia="Instagram" />} />
                          <Route exact path="/link-whatsapp" element={<LinkSocialMediaPage typeSocialMedia="Whatsapp" />} />
                        </Route>
         
                    </Route> 

            }
          

          {
             here &&  <Route element={<ProtectedRoute allowedRoles={['owner']}
             userRole={user?.role} isPayment={true}  />}>
               <Route path="/plans" element={<PlansPage />} />


            </Route>
          }

            



          {
              here &&  <Route element={<ProtectedRoute allowedRoles={['owner','agent']}
              userRole={user?.role} isPayment={isPayment}  />}>
      
                          
                      <Route exact path="/settings" element={<SettingsPage />} />
                      <Route path="/notification" element={<NotificationPage />} />
                      <Route element={<ProtectedRouteSocialMedia  />}>

                      <Route exact path="/telegram" element={<SocialMediaPage socialMedia="telegram"  />} />
                      <Route exact path="/facebook" element={<SocialMediaPage socialMedia="facebook"  />} />
                      <Route exact path="/instagram" element={<SocialMediaPage socialMedia="instagram"  />} />
                      <Route exact path="/whatsapp" element={<SocialMediaPage socialMedia="whatsapp"  />} />

                      </Route>
                    </Route>

            }
            
          




              <Route element={<UnProtectedRoute />}>

                <Route  path="/login" element={<LogInPage />} />
                <Route  path="/signUp" element={<SignUpPage />} />
                <Route  path="/login/identify" element={<SendTokenChangePasswordPage />} />

                <Route  path="/confirm_email" element={<ConfirmEmailPage />} />
                <Route  path="/activate/:token/:uid" element={<VerifiedPage />} />
                <Route  path="/change-password/:token/:uid" element={<ChangePasswordPage />} />

              </Route>
           
            <Route  path="/" element={<LandingPage />} /> 

             {/* <Route path="*" element={<NotFoundPage />} /> */}

            

             
   </Routes> 
   </div>

      
   <ToastContainer
            position="top-right"
            autoClose={4000}
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










/*
Auth : 
  ->Owner
    <Route exact path="/settings" element={<SettingsPage />} />
                <Route path="/notification" element={<NotificationPage />} />

                <Route element={<ProtectedRouteOwner role={user.role} />}>
                  <Route exact path="/dashboard" element={<DashboardPage />} />
                  <Route exact path="/agents" element={<AgentsPage />} />
                  <Route exact path="/departments" element={<DepartmentsPage />} />
                  <Route path="/plans" element={<PlansPage />} />
                  <Route path="/plan/:id" element={<PaymentPlanPage />} />
                  <Route exact path="/payment" element={<PaymentPage />} />
                </Route>

                <Route element={<PrivateRouteSocialMedia />}>
                  <Route exact path="/telegram" element={<LinkSocialMediaPage socialMedia="telegram"  />} />
                  <Route exact path="/facebook" element={<LinkSocialMediaPage socialMedia="facebook"  />} />
                  <Route exact path="/instagram" element={<LinkSocialMediaPage socialMedia="instagram"  />} />
                  <Route exact path="/whatsapp" element={<LinkSocialMediaPage socialMedia="whatsapp"  />} />
                </Route>

                <Route element={<PrivateRouteSocialMedia2 />}>
                  <Route exact path="/link-telegram" element={<LinkTelegramPage typeSocialMedia="Telegram" />} />
                  <Route exact path="/link-facebook" element={<LinkTelegramPage typeSocialMedia="Facebook" />} />
                  <Route exact path="/link-instagram" element={<LinkTelegramPage typeSocialMedia="Instagram" />} />
                  <Route exact path="/link-whatsapp" element={<LinkTelegramPage typeSocialMedia="Whatsapp" />} />
                </Route>


  ->Agant



  ->NoAuth
   <Route  path="/" element={<LandingPage />} /> 
                <Route  path="/login" element={<LogInPage />} />
                <Route  path="/signUp" element={<SignUpPage />} />
                <Route  path="/login/identify" element={<SendTokenChangePasswordPage />} />

                <Route  path="/confirm_email" element={<ConfirmEmailPage />} />
                <Route  path="/activate/:token" element={<VerifiedPage />} />
                <Route  path="/change-password/:token" element={<ChangePasswordPage />} />
NoAuth:

*/
