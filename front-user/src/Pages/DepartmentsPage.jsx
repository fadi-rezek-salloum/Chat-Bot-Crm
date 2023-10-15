import React , {useContext  , useState , useEffect} from 'react'
import TopBar from '../Components/Layout/TopBar'
import Departments from '../Components/Departments/Departments'
import axios from 'axios';
import AuthContext from "../contexts/AuthContext";

const DepartmentsPage = () => {
  let baseUrl=process.env.REACT_APP_DEPARTMENTS_URL
  let url_GET_DEPARTEMENT=`${baseUrl}`
   const {authTokens} = useContext(AuthContext)
   
   const [departments, setDepartments] = useState([]);
   const [filtered, setFiltered] = useState(departments);
 
 
   useEffect(() => {
    getDepartement();
   }, []);
 
 //API Request Get All Agent
 //API Request Get All Departement
const getDepartement = async () => {
  try {

    const response = await axios.get(url_GET_DEPARTEMENT, 
   
    {
      headers: {
        Authorization: `Bearer ${authTokens}`
      }
    }
    );

    console.log(response.data.departments)
    if (response.status === 200) {
      // Sign-up successful
      setDepartments(response.data.departments)
      setFiltered(response.data.departments)

      // Redirect or show success message
    }
  } catch (error) {
  
      console.log(error)



    
  }
  // setIsLoading(false); // Stop loading indicator

}
return (
  <div className='w-full h-full flex flex-col'>
     { authTokens && <TopBar
     title = "Departments"
     description = "Manage your departments"
     isSearch = {true}
     placeholderShearch = "Search departments"
     list = {departments}
     setFiltered = {setFiltered}
     className="z-10"
     /> }
 <Departments 
     departments={filtered}
     setDepartments = {setFiltered}
     setDepartmentsorignal = {setDepartments}
     className="z-20"
 />

</div>

)
}

export default DepartmentsPage



