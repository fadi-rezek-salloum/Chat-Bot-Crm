import React , {useContext , useState}  from 'react'
import {IoMdClose} from "react-icons/io"
import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
import Loader from '../Loader';
import {  toast } from 'react-toastify';

const PopUp_BlockOwner = (props) => {
    const [loading,setLoading]=useState(false)
    const [urlBlock,setUrlBlock]=useState(
        props.type==="Block"
        ? "block-user"
        : "unblock-user"
      )
  
    let baseUrl_USER=process.env.REACT_APP_USERS_URL
  
  
  
    const {authTokens} = useContext(AuthContext)
    const blockAgent = async (event, row) => {
        console.log(authTokens)
        setLoading(true)
        try {
      
            const response = await axios.post( `${baseUrl_USER}${urlBlock}?user_id=${props.ownerSelect.id}`, 
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
              if(urlBlock === "block-user"){
                toast.success("Owner has been successfully blocked")
                // props.setOwners([...props.owners, { is_active:false }]);
                const updatedOwners = props.owners.map((owner) => {
                  if (owner.id === props.ownerSelect.id) {
                    return { ...owner, is_active: false };
                  }
                  return owner;
                });
                props.setOwners(updatedOwners);

              }else{
                toast.success("The block on the owner has been successfully removed")
                const updatedOwners = props.owners.map((owner) => {
                  if (owner.id === props.ownerSelect.id) {
                    return { ...owner, is_active: true };
                  }
                  return owner;
                });
                props.setOwners(updatedOwners);

              }

              
          
              
            }
          } catch (error) {
      
              console.log(error)
      
      
              toast.error("An error has occurred , try again" )

      
            
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
           {
            props.type==="Block" ?  "Do you really want to block this owner?" :
            "Do you really want to unblock this owner?"
           }
       

         
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
                    blockAgent();

                   }}
                   
                   >
                   {props.type}
                </button>
                
               
               

         </div>
    </div>
 }
    
   

    </div>
</div>
  )
}

export default PopUp_BlockOwner