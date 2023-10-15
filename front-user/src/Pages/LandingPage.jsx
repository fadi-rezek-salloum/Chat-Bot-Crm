import React,{useContext , useEffect , useState} from 'react'
import NavBar from '../Components/Landing/NavBar'
import Intro from '../Components/Landing/Intro'
import Product from '../Components/Landing/Product'
import Features from '../Components/Landing/Features'
import WhyCRMchatbot from '../Components/Landing/WhyCRMchatbot'
import Plans from '../Components/Landing/Plans'
import Footer from '../Components/Landing/Footer'
import background_leandingPage from '../Assets/land.png'
import backround_leading_2 from '../Assets/background_Landing_page2.png'
import backround_leading_3 from '../Assets/background_leanding_page3.png'
import AuthContext from "../contexts/AuthContext";
import { useStateContext } from "../contexts/ContextProvider";
import NavBarMobile from '../Components/Landing/NavBarMobile'

const LandingPage = () => {
  const {setIsLandingPage } = useContext(AuthContext)

  const [activeNabBarMobile,setActiveNabBarMobile] = useState(false);
  const [screenSize,setScreenSize] = useState(undefined)

  useEffect(()=>{
    const handleResize = ()=> setScreenSize(window.innerWidth)
    window.addEventListener('resize',handleResize)
    
    handleResize();
    return ()=>window.removeEventListener('resize',handleResize)
    },[])

    useEffect(()=>{
      if(screenSize <= 620 ){setActiveNabBarMobile(true)}
      else{setActiveNabBarMobile(false)}
      },[screenSize])   


  return (
    <div>
       { activeNabBarMobile &&    <NavBarMobile/> }
       <div className='w-full h-full '>
<div className='w-full py-4 px-7 md:py-4 md:px-24  font-inter flex flex-col h-max'
    style= 
    {{ 
      backgroundImage: `url(${background_leandingPage}) `  ,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} 
    >
      {
        !activeNabBarMobile ?  <NavBar/> : ""
      }

            <Intro/>
  </div>
            
<div className='w-full py-4 px-7 md:py-4 md:px-24  font-inter flex flex-col'>    
   <Product/>
          
</div>

<div className='w-full  py-4 px-7 md:py-4 md:px-24  font-inter flex flex-col'
style= 
{{ 
  backgroundImage: `url(${backround_leading_2}) `  ,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
 }} 
>
  <Features/>
  </div>
  <div className='w-full py-4 px-7  ssm:px-10  md:py-4 md:px-24  font-inter flex flex-col'>

   <WhyCRMchatbot/>
  </div>

  <div className='w-full   px-7 md:py-4 md:px-24   font-inter flex flex-col'
style= 
{{ 
  backgroundImage: `url(${backround_leading_3}) `  ,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
 }} 
>
  <Plans isLandingPage={true}/>
  </div>
  <Footer/>


</div>

    </div>

  
  )
}

export default LandingPage

