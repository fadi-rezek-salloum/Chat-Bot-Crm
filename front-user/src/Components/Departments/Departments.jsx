
import React , {   useState  , useMemo , useContext} from 'react'
import {BiEditAlt } from 'react-icons/bi'
import {AiOutlineDelete} from 'react-icons/ai'
import {IoMdAdd} from 'react-icons/io'


import { DataGrid    } from "@mui/x-data-grid";
import PopUp_AddDepartment from './PopUp_AddDepartment';
import AuthContext from "../../contexts/AuthContext";
import PopUp_succussfully from '../Agents/PopUp_succussfully';
import PopUp_delete from '../Agents/PopUp_delete';

const Departments = ({departments, setDepartments,setDepartmentsorignal}) => {


    const [departmentSelect, setDepartmentSelect] = useState();

    

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
    setShowPopup(true)
    setTypePopup({type:"edit"})
    setDepartmentSelect(row);
  };

const columns =useMemo(()=> [
  {
    field: "id",
    headerName: "Department ID",
    minWidth: 200,
    flex: 2,
    headerClassName: "super-app-theme--header",
    renderCell: (param) => (
      <p className=" hover:cursor-pointer w-full flex justify-start items-center  text-sm text-primary">
        {param.formattedValue}
      </p>
    ),
  },

  {
      field: "department_name",
      headerName: "Department name",
      minWidth: 150,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center font-semibold  text-sm text-primary ">
          {param.formattedValue}
        </p>
      ),
    },

    {
      field: "agents_count",
      headerName: "Number of agents",
      minWidth: 150,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center  text-sm text-primary ">
          {param.formattedValue}
        </p>
      ),
    },

    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center  text-sm text-primary">
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
        


          <div className=" w-full flex  gap-6  justify-center items-center text-primary">
            {
              params.row.department_name !== "service client" ?
              <div className='w-full flex  gap-6  justify-center items-center text-primary '>
                <BiEditAlt className='h-6 w-6 text-primary cursor-pointer'
              onClick={(e) => handleActionClick(e, params.row)} 
            />

            <AiOutlineDelete className='h-6 w-6 text-red-500 cursor-pointer'
              onClick={(e) => deleteDepartement(e, params.row)} 
            />
              </div> : <div></div>
            }
            
            
          </div>



        ),

    },  ],
    [anchorEl, selectedRow])


   



const deleteDepartement = async (event, row) => {
  setAnchorEl(event.currentTarget);
  setSelectedRow(row);
  setShowPopup(true)
  setTypePopup({type : "Delete" , text:"Do you really want to delete this departments?"})
  setDepartmentSelect(row);
  }



  return (
    <div className='px-10 py-6 w-full sm:mt-0 mt-20 animate-slideup'>





    <div className=' flex justify-end ' 
      onClick={ ()=>{
        setTypePopup({type:"Add"})

        setShowPopup(true)

        }
         }>
            <div className='flex shadow-lg
                shadow-primary-500/50  cursor-pointer
                bg-gradient-to-r from-[#6F6C99] via-[#39375E] to-[#211E47] opacity-75

            rounded-3xl w-max px-6 py-2 text-white items-center justify-center gap-1'>
                <IoMdAdd className=' font-extrabold'/>
                Add new department
            </div>
        </div>


    <div className='rounded-2xl  w-full h-[500px] px-2 py-2 shadow-[0_5px_16px_0px_rgba(0,0,0,0.1)] mt-4'
>
    <DataGrid
        columns={columns}
        rows={departments}
        getRowId={(row) => row.id}
        
        
         pageSize={7}
         localeText={ { noRowsLabel: "You don't have departments"}}
        {...departments}
        initialState={{
          ...departments.initialState,
          pagination: { paginationModel: { pageSize: 7 } },
        }}

     
     
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
              backgroundColor: "#4C4C66", // Change to the desired color
              color: `white`,
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
                
                   ( typePopup.type==="Add" || typePopup.type==="edit") ? (<PopUp_AddDepartment
                    
                    setShowPopup={setShowPopup}
                    setTypePopup={setTypePopup}
                    departments={departments}
                    typePopup={typePopup}
                    setDepartments={setDepartments}
                    setDepartmentsorignal={setDepartmentsorignal}
                    departmentSelect={departmentSelect}
                    />): typePopup.type==="Delete" ? (
                          <PopUp_delete 
                          setShowPopup={setShowPopup}
                          typePopup={typePopup}
                          setTypePopup={setTypePopup}
                          departments={departments}
                          setDepartments={setDepartments}
                          setDepartmentsorignal={setDepartmentsorignal}
                          departmentSelect={departmentSelect}
                          isDep = {true}
                          />
                           )
                         
                         
                         : typePopup.type==="succussfuly" ? (
                         <PopUp_succussfully 
                         setShowPopup={setShowPopup}
                         typePopup={typePopup}
                         />
                          ) : ( 
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

export default Departments