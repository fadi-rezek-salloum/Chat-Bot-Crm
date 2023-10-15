import React , {useContext , useState}  from 'react'
import {IoMdClose} from "react-icons/io"
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import Loader from '../Loader';
const PopUp_delete = (props) => {
  const [loading,setLoading]=useState(false)
  const [urlBlock,setUrlBlock]=useState(
    props.typePopup.type==="Block"
    ? "block-user"
    : "unblock-user"
  )
  const isActive  = props.typePopup.type==="Block";
  let baseUrl_USER=process.env.REACT_APP_USERS_URL
  let baseUrl=process.env.REACT_APP_DEPARTMENTS_URL



  const {authTokens} = useContext(AuthContext)

  

  //Block
  //Delete
  
const deleteAgent = async () => {

  setLoading(true)
  try {

      const response = await axios.delete(`${baseUrl}agents/${props.agentSelect.id}/`, 
     
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );


      if (response.status === 200) {
        const resulte =  props.agents.filter((agent) => agent.id !== props.agentSelect.id);
         props.setAgents(
          resulte
        );
        props.setAgentsorignal(
            resulte
            );
          
          console.log(  props.agents.filter((agent) => agent.id !== props.agentSelect.id))
        
      }
    } catch (error) {

        console.log(error)




      
    }
    setLoading(false);
    props.setShowPopup(false)
}


const blockAgent = async () => {
  console.log(authTokens)
  setLoading(true)
  try {

      const response = await axios.post( `${baseUrl_USER}${urlBlock}?user_id=${props.agentSelect.id}`, 
      {
      },
      {
        headers: {
          Authorization: `Bearer ${authTokens}`
        }
      }
      );
      console.log(response)


      if (response.status === 200) {
       
        const updatedAgents =  props.agents.map((agent) => {
          if (agent.id === props.agentSelect.id) {
            return { ...agent,
              "is_active":  !isActive,
            };
          }
          return agent;
        });
    
        props.setAgents(updatedAgents);

        props.setAgentsorignal(
          updatedAgents
          );
      }
    } catch (error) {

        console.log(error)




      
    }
    setLoading(false);
    props.setShowPopup(false)
}



const deleteDepartement = async () => {
  setLoading(true)



    try {

      const response = await axios.delete(`${baseUrl}${props.departmentSelect.id}`, 
       
        {
          headers: {
            Authorization: `Bearer ${authTokens}`
          }
        }
        );
  

        if (response.status === 200) {
    


        const resulte =  props.departments.filter((dep) => dep.id !== props.departmentSelect.id);
        props.setDepartments(
         resulte
       );
       props.setDepartmentsorignal(
           resulte
           );
         

        }
      } catch (error) {
      
          console.log(error)
       

       
          props.setTypePopup(
           
            {
                type:"filed",
                text:"An error occurred while deleting The department"
            }
            )

  
        
      }
      setLoading(false);
      props.setShowPopup(false)

  }

  return (
    <div className=" relative  flex justify-center flex-col items-center animate-slideup bg-white dark:bg-[#1C1817]  md:w-[40%] w-[60%] h-[33%] rounded-2xl z-[10]   ">
    <div className=' w-full flex justify-end items-center absolute top-3 right-3' >
      <IoMdClose onClick={()=>{props.setShowPopup(false)}} className=' hover:cursor-pointer hover:drop-shadow-xl rounded-full text-primary text-[30px]' />


    </div>

    <div className='  justify-center items-center flex flex-col w-full gap-6' >
  
        <p className="text-primary text-lg  ">
           
       { props.typePopup.text}

         
            </p>
        {loading ? <div className="  flex items-center justify-center  w-full mt-8 text-gradient-to-r from-[#EC3131] via-[#970505] to-[#852f2f]"> <Loader /> </div>    :

        <div className=' w-full flex flex-row gap-6 justify-center items-center' >
       

        <div className=' flex justify-end items-center w-[80%] gap-6 ' >
                <button 
                onClick={()=>{props.setShowPopup(false)}} 
                className=' text-white 
                 w-full
                 bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75
                    py-4
                  rounded-3xl
                    flex items-center justify-center ' >
                   Cancle
                </button>


                
                <button 
                
                className=' text-white 
                 w-full
                 bg-gradient-to-r from-[#EC3131] via-[#970505] to-[#852f2f] opacity-75
                    py-4
                  rounded-3xl
                   flex items-center justify-center shadow-md ' 
                   onClick={()=>{
                    if(props.typePopup.type==="Delete" ){
                      if(props.isDep){
                        deleteDepartement();
                      }else{
                        deleteAgent();
                      }
                     
                    }
                    
                    else {
                      blockAgent();
                      alert("kk")
                    }

                   }}
                   
                   >
                   {props.typePopup.type}
                </button>
                
               
               

         </div>
    </div>
 }
    
   

    </div>
</div>
  )
}

export default PopUp_delete