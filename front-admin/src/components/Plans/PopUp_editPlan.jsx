import React,{useState , useContext , useEffect} from 'react'
import {IoMdClose} from "react-icons/io"
import {IoAddSharp} from "react-icons/io5"
import Loader from '../Loader'
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import {  toast } from 'react-toastify';
import {RiDeleteBinLine} from 'react-icons/ri'


const PopUp_editPlan = ({setShowPopup ,  plans,setPlans , features ,setFeatures , indexPlan}) => {
    let baseUrl=process.env.REACT_APP_PAYMENTS_URL
    let url_Features=`${baseUrl}features`
    let url_update_Plan=`${baseUrl}plans/`


    const [loading,setLoading]=useState(false)

    const {authTokens} = useContext(AuthContext)
    
    const [formValues, setFormValues] = useState({
      name:plans[indexPlan].name,
      quarterly_price:plans[indexPlan].quarterly_price,
      monthly_price:plans[indexPlan].monthly_price,
      yearly_price:plans[indexPlan].yearly_price,

    });
    const [selectedFeatures, setSelectedFeatures] = useState([

    ]);
    useEffect(() => {
      // Create an array of feature names from plans.features
      const planFeatureNames = plans[indexPlan].features.map((feature) => feature.name);
  
      // Filter the features list to include only those that exist in planFeatureNames
      const initialSelectedFeatures = features.filter((feature) =>
        planFeatureNames.includes(feature.name)
      );
  
      // Set the initial selectedFeatures state
      setSelectedFeatures(initialSelectedFeatures);
    }, [plans[indexPlan].features, features]);


    

    const handleChange = (e) => {
      
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
      };

      const handleFeatureToggle = (feature) => {
        // Check if the feature is already in the selectedFeatures array
        const featureIndex = selectedFeatures.findIndex(
          (item) => item.name === feature.name);
    
        if (featureIndex !== -1) {
          // If the feature is found, remove it from the array
          const updatedFeatures = [...selectedFeatures];
          updatedFeatures.splice(featureIndex, 1);
          setSelectedFeatures(updatedFeatures);
        } else {
          // If the feature is not found, add it to the array
          setSelectedFeatures([...selectedFeatures, { name: feature.name , id:feature.id  }]);
        }
      };

    const Add_features = async () => {
       if(features.length < 5 ){
        try {
      
       
      
          const response = await axios.post(url_Features, 
          {
            "name": formValues.feature
    
    
          },
          {
            headers: {
              Authorization: `Bearer ${authTokens}`
            }
          }
          );
    
        

          if (response.status === 201) {
            // Sign-up successful
            toast.success("feature added successfully")

           
              setFeatures([...features, { id:response.data.feature.id , name:response.data.feature.name }]);

           
          }
        } catch (error) {

            console.log(error)
          toast.error(error.response.data.detail)

          
        }
       }else{
        toast.warning("you don't can ")
       }


       
      
        }

    const deleteFeature = async (feature_id) => {
      console.log(`${url_Features}/${feature_id}`)
           try {
         
          
         
             const response = await axios.delete(`${url_Features}/${feature_id}`, 
            
             {
               headers: {
                 Authorization: `Bearer ${authTokens}`
               }
             }
             );
       
             console.log(response)
             if (response.status === 200) {
               // Sign-up successful
               toast.success("feature deleted successfully")
               setFeatures(features.filter((feature) => feature.id !== feature_id));

              //  setChange(!change)
              
             }
           } catch (error) {
   
               console.log(error)
             toast.error(error.response.data.detail)
   
             
           }
         
   
   
          
         
           }

   


    const update_plan = async () => {
      setLoading(true)
      console.log(selectedFeatures)
      if(formValues.monthly_price!=="0" && formValues.quarterly_price!=="0" && formValues.yearly_price!=="0" ){

    
      try {
      
       
      
        const response = await axios.put(`${url_update_Plan}${plans[indexPlan].id}`, 
        {
          name: formValues.name,
          monthly_price : formValues.monthly_price,
          quarterly_price : formValues.quarterly_price,
          yearly_price : formValues.yearly_price,
          features:selectedFeatures

  
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
  
        console.log("selectedFeatures" + selectedFeatures)
        if (response.status === 200) {
          // Sign-up successful
          toast.success("plan updated successfully")
          const updatedPlan = plans.map((plan) => {
            if (plan.id === plans[indexPlan].id) {
              return { ...plan,
                name: formValues.name,
                monthly_price: formValues.monthly_price,
                quarterly_price: formValues.quarterly_price,
                yearly_price: formValues.yearly_price,
                features: selectedFeatures
              };
            }
            return plan;
          });
      
          setPlans(updatedPlan);
         
          setShowPopup(false)
         
        }
      } catch (error) {

          console.log(error)
        toast.error(error.response.data.detail)

        
      }
    }else{
      toast.error('You cannot write 0')

    }
  
    setLoading(false)

     
    }

    return (
        <div className=" font-inter px-20  py-9 relative  flex  justify-start items-center 
        flex-col  animate-slideup bg-white dark:bg-[#1C1817]
          md:w-[80%] w-[80%] h-max rounded-2xl z-[10]   ">
            
            <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
            <IoMdClose onClick={()=>{setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />
            </div>

            <div className='flex flex-col w-full h-full gap-6'>
            <div className='flex flex-col  w-full gap-1  '>
                <p className='px-5'>Name : </p>
            <div className={`border  py-2.5 px-5
                    flex  justify-start items-center rounded-3xl               
                    `}>
                    
                    
                    <input className='focus:outline-none px-2 py-0.5 w-full  '
                            type='text'
                            name="name"    
                             value={formValues.name}
                             onChange={handleChange}
                            placeholder="Name"/>
                
                </div>
                </div>
                <div className='w-full flex gap-10 justify-between items-center '>
                <div className='flex flex-col  w-full gap-1  '>
                <p className='px-5'>Monthly price : </p>
                <div className={`border  py-2.5 px-5
                            flex  justify-start items-center rounded-3xl   w-full               
                            `}>

                            <input className='focus:outline-none px-2 py-0.5 w-full  '
                               type="number" min="0" 
                               name="monthly_price"    
                                value={formValues.monthly_price}
                                onChange={handleChange}
                               
                            placeholder="Monthly price"/>
                            
                </div>
                </div>
              
                <div className='flex flex-col  w-full gap-1  '>
                <p className='px-5'>Quarterly price :</p>
                        <div className={`border  py-2.5 px-5
                            flex  justify-start items-center rounded-3xl   w-full               
                            `}>
                            <input className='focus:outline-none px-2 py-0.5 w-full  '
                               type="number" min="0" 
                               name="quarterly_price"    
                                value={formValues.quarterly_price}
                                onChange={handleChange}
                               
                            placeholder="Quarterly price"/>
                            
                        </div>
                        </div>
                        <div className='flex flex-col  w-full gap-1  '>
                <p className='px-5'>Yearly price :</p>
                        <div className={`border  py-2.5 px-5
                            flex  justify-start items-center rounded-3xl    w-full              
                            `}>
                            <input className='focus:outline-none px-2 py-0.5 w-full  '
                                    type="number" min="0" 
                                    name="yearly_price"    
                                     value={formValues.yearly_price}
                                     onChange={handleChange}
                            placeholder="Yearly price"/>
                            
                        </div>
                        </div>

                </div>


                <div className={`border  py-2.5 px-5
                    flex  justify-start items-center rounded-3xl               
                    `}>
                    
                    
                    <input className='focus:outline-none px-2 py-0.5 w-full  '
                            type='text'
                            name="feature"    
                            value={formValues.feature}
                            onChange={handleChange}
                            placeholder="Add options"/>
                    <IoAddSharp 
                    className='w-[20px] h-[20px] text-primary cursor-pointer hover:rounded-full hover:bg-primary hover:text-white' 
                    
                        onClick={()=>{
                            Add_features() 
                            }}
                    />
                </div>

                <div className='w-full h-max border  py-3 px-7 rounded-[35px] flex flex-col gap-2'>
                {features.map((feature) => (
               

                  <div className='flex justify-between items-center gap-3 py-1' key={feature.id}>
                   <div className='flex w-[90%] gap-3  items-center'>
                   <input type='checkbox' className='text-primary'
                   onChange={() => handleFeatureToggle(feature)}
                   checked={selectedFeatures.some((item) => item.name === feature.name)}
                   
                   />
                    <p className='text-base text-primary'>{feature.name}</p>
                   </div>

                    <RiDeleteBinLine 
                    className='text-red-500 cursor-pointer' 
                    onClick={()=>{deleteFeature(feature.id)}}/>
                  </div>
                 ))}
                  
                  
                  
                </div>
                <div className='w-full flex justify-center items-center'>
                {loading ? <div className=""> <Loader /> </div>    :

                <div className='flex shadow-lg text-white  w-[20%]     
                shadow-primary-500/50     px-4 py-3 
                bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

                rounded-3xl    items-center justify-center gap-1 cursor-pointer'
                onClick={update_plan} 

                >
              
                Save
                </div>
                }
                </div>
            </div>


              
    </div>
      )
}

export default PopUp_editPlan