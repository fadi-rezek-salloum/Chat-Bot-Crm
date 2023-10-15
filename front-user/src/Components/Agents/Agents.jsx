import React ,{ useMemo, useState , useEffect , useContext} from 'react'
import {CiMenuKebab} from 'react-icons/ci'
import {CgUnblock} from 'react-icons/cg'

import {MdPersonAddAlt1 , MdBlock} from 'react-icons/md'

import {BiEditAlt} from 'react-icons/bi'
import {RiDeleteBinLine} from 'react-icons/ri'


import { DataGrid   } from "@mui/x-data-grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopUp_delete from './PopUp_delete'
import PopUp_addAgent from './PopUp_addAgent'
import PopUp_succussfully from './PopUp_succussfully'
import { useStateContext } from "../../contexts/ContextProvider";

import axios from 'axios';
import AuthContext from "../../contexts/AuthContext";
const Agents = ({agents , setAgents,setAgentsorignal}) => {
  const {authTokens} = useContext(AuthContext)

  let baseUrl=process.env.REACT_APP_DEPARTMENTS_URL
  let url_GET_DEPARTEMENT=`${baseUrl}`
  const {departments, setDepartments } = useStateContext()

  const [agentSelect, setAgentSelect] = useState({});


    const [showPopup, setShowPopup] = useState(false);
    const [typePopup, setTypePopup] = useState({
      type:"",
      text:""
  });
 
  

    
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleActionClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
        setAgentSelect(row);

      };
    
      const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedRow(null);
      };
    
      const handleMenuOptionClick = (option) => {
        handleCloseMenu();
        // Handle the selected option (edit, delete, block)
        if(option === "Delete"){
          setTypePopup({type : option , text:"Do you really want to delete this agent?"})

        }else if(option === "Edit"){
          setTypePopup({type : option , text:"Do you really want to block this agent?"})

        }
        else if(option === "Block"){
          setTypePopup({type : option , text:"Do you really want to block this agent?"})

        }else if(option === "UnBlock"){
          setTypePopup({type : option , text:"Do you really want to unblock this agent?"})

        }

        

        
        setShowPopup(true);
      };

      
    const columns =useMemo(()=> [
        {
          field: "id",
          headerName: "Agent ID",
          minWidth: 310,
          flex: 3,
          headerClassName: "super-app-theme--header",
          renderCell: (param) => (
            <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
              {param.formattedValue}
            </p>
          ),
        },

        {
            field: "username",
            headerName: "Agent",
            minWidth: 200,
            flex: 2,
            renderCell: (param) => (
              <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
                {param.formattedValue}
              </p>
            ),
          },

          {
            field: "phone_number",
            headerName: "Phone number",
            minWidth: 150,
            flex: 2,
            renderCell: (param) => (
              <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
                {param.formattedValue}
              </p>
            ),
          },

          {
            field: "email",
            headerName: "Email address",
            minWidth: 210,
            flex: 2,
            renderCell: (param) => (
              <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
                {param.formattedValue}
              </p>
            ),
          },

          {
            field: "department_name",
            headerName: "Department",
            minWidth: 100,
            flex: 2,
            renderCell: (param) => (
              <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
                {param.formattedValue}
              </p>
            ),
          },

          {
            field: "actions",
            headerName: "Action",
            minWidth: 100,
            flex: 2,
            type:"actions",
            renderCell: (params) => (
                <div className="hover:cursor-pointer w-full flex  justify-center items-center">
                  <CiMenuKebab onClick={(e) => handleActionClick(e, params.row)} />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedRow && selectedRow.id === params.row.id)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        style: {
                          width: '200px', // Adjust the width as needed

                          marginRight: '20px',
                          padding: '5px', // Add padding for the content
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                          borderRadius: '11px', // Add border radius

                        },
                      }}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left', // Set 'left' to move the menu to the left
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right', // Set 'left' to move the menu to the left
                      }}
                  >
                    <div className='bg-white text-primary rounded-xl'>
                    <MenuItem onClick={() => handleMenuOptionClick('Edit')}>
                        <div className='flex  justify-center items-center gap-4'>
                            <BiEditAlt/>
                            Edit
                        </div>
                        
                        </MenuItem>
                    <MenuItem onClick={() => handleMenuOptionClick('Delete')}>
                           <div className='flex  justify-center items-center gap-4'>
                            <RiDeleteBinLine/>
                            Delete
                        </div>
                        
                        </MenuItem>
                        {
                           params.row.is_active  ? 
                           <MenuItem onClick={() => handleMenuOptionClick('Block')}>
                        
                    
                  
                        
                           <div className='flex  justify-center items-center gap-4'>
                              <MdBlock/>
                              Block
                          </div> 
                          
                          </MenuItem>
                          :
                          <MenuItem onClick={() => handleMenuOptionClick('UnBlock')}>
                        
                     
                          <div className='flex  justify-center items-center gap-4'>
                             <CgUnblock/>
                             UnBlock
                         </div> 
                         
                         
                         </MenuItem>

                        }
                   
                       
                    </div>
                   
                  </Menu>
                </div>
              ),
          },  ],
          [anchorEl, selectedRow])
 
          
   
    
 

 
    const getRowClassName = (params) => {
      return params.row.is_active ? '' : 'bg-red-100';
    };


  
    
  useEffect(() => {
    getDepartement();
  }, []);

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
    setDepartments(
     
      response.data.departments.map(item => ({ value: item.id, label: item.department_name }))
      )

    }
} catch (error) {

    console.log(error)



  
}
// setIsLoading(false); // Stop loading indicator

}
        
  return (
    <div className='px-10 py-6 w-full sm:mt-0 mt-20 animate-slideup'>
        <div className=' flex justify-end  cursor-pointer '
         onClick={ ()=>{
          setTypePopup({type:"Add"})
          setShowPopup(true)
          }
           }
        >
            <div className='flex shadow-lg
                shadow-primary-500/50 
                bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

            rounded-3xl w-max px-6 py-2 text-white items-center justify-center gap-1'>
                <MdPersonAddAlt1/>
                Add new agent
            </div>
        </div>
        <div className='rounded-2xl  w-full  h-[500px]  px-2 py-2 shadow-[0_5px_16px_0px_rgba(0,0,0,0.1)] mt-4'
>
        <DataGrid
            columns={columns}
            rows={agents}
            data={agents}
            getRowId={(row) => row.id}
           
            localeText={ { noRowsLabel: "You don't have agents"}}

             pageSize={7}
  
            {...agents}
            initialState={{
              ...agents.initialState,
              pagination: { paginationModel: { pageSize: 7 } },
            }}
         
         
            getRowClassName={getRowClassName}

            pageSizeOptions={[7, 14, 21]}    
         sx={{
                position: "relative",
                backgroundImage: undefined,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                ".super-app-theme--header": {
                  fontWeight: 900,
                  color: "gray",
                  fontSize: "15px",
                  fontFamily: "unset",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .MuiDataGrid-colCellWrapper": {
                  borderBottom: "none",
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
                "& .MuiDataGrid-row": {
                  border: "none",
                  
                  
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                // "& .MuiDataGrid-footerContainer": {
                //   display: "none",
                // },
                ".MuiDataGrid-columnSeparator": {
                  display: "none",
                },
                "&.MuiDataGrid-root": {
                  border: "none",
                  color: `black`,
                },
                "& .MuiTablePagination-root": {
                  color: `black`,
                },
                "& .MuiDataGrid-iconSeparator": {
                  color: `black`,
                },
                "& .MuiTablePagination-caption": {
                  color: `black`,
                },
                "& .MuiTablePagination-select": {
                  color: `black`,
                },
  
                "& .MuiDataGrid-page": {
                  color: `black`,
                },
                "& .MuiTablePagination-selectIcon": {
                  color: `black`,
                },
  
                "& .MuiTablePagination-actions button": {
                  color: `black`,
                },
                "& .MuiTablePagination-actions button:hover": {
                  backgroundColor: "red",
                  color: `black`,
                },
                "& .MuiPaginationItem-root": {
                  color: `black`,
                },
                "& .MuiPaginationItem": {
                  color: `black`,
                },

                
              }}
        >
            
        </DataGrid>

   
        </div>    
  
        {showPopup && (
        <div className=" fixed left-0 top-0 w-[100%] 
         h-screen bg-black 
         bg-opacity-60 backdrop-blur-[1px] 
         z-[9999] flex justify-center items-center  ">
         


{
                
                (typePopup.type==="Add" ||  typePopup.type==="Edit") ? (<PopUp_addAgent
                setShowPopup={setShowPopup}
                setAgents={setAgents}
                setAgentsorignal = {setAgentsorignal}
                setTypePopup={setTypePopup}
                typePopup={typePopup}
                departments={departments}
                agents = {agents}
                agentSelect={agentSelect}
                
                />)
                : (typePopup.type==="Delete" || typePopup.type==="Block" || typePopup.type==="UnBlock")  ? (
                    <PopUp_delete 
                    setShowPopup={setShowPopup}
                    typePopup={typePopup}
                    agentSelect={agentSelect}
                    setAgents={setAgents}
                    agents = {agents}
                    setAgentsorignal = {setAgentsorignal}
                    />
                     )
           
                      : ( 
                      <PopUp_succussfully
                      setShowPopup={setShowPopup}

                      typePopup={typePopup}
                      /> 
                      ) 
            
           
           
        }
          
        </div>
      )
      
      
      
      }

    </div>
  )
}

export default Agents