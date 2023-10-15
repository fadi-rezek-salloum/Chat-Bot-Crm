import React , {   useState  , useMemo} from 'react'
import {AiOutlineCloudDownload} from 'react-icons/ai'
import { DataGrid    } from "@mui/x-data-grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {CiMenuKebab} from 'react-icons/ci'
import {CgUnblock} from 'react-icons/cg'

import {MdPersonAddAlt1 , MdBlock , MdPayment} from 'react-icons/md'

import {BiEditAlt} from 'react-icons/bi'
import {RiDeleteBinLine} from 'react-icons/ri'
import PopUp_BlockOwner from './PopUp_BlockOwner';
import { useNavigate } from "react-router-dom";

const Owner = ({owners , setOwners}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [type, setType] = useState(false);

    const [ownerSelect, setOwnerSelect] = useState({});
    const history = useNavigate();

  const handleActionClick = (event, row) => {
      setAnchorEl(event.currentTarget);
      setSelectedRow(row);
      setOwnerSelect(row);
      console.log(`Selected option: for row: ${row}`)
    };
    const handleCloseMenu = () => {
      setAnchorEl(null);
      setSelectedRow(null);
    };
  
    const handleMenuOptionClick = (option) => {
      handleCloseMenu();
      // Handle the selected option (edit, delete, block)
      if(option === "Block" || option === "UnBlock" ){
        setShowPopup(true);
        setType(option)

      }else{
        history(`/payment/${ownerSelect.id}` , { state: { username:ownerSelect.username  } });

      }
     


      
      // setShowPopup(true);
    };
 

  
  const columns =useMemo(()=> [
    {
      field: "id",
      headerName: "Owner ID",
      minWidth: 300,
      flex: 2,
      headerClassName: "super-app-theme--header",
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
          {param.formattedValue}
        </p>
      ),
    },
  
    {
        field: "username",
        headerName: "Owner",
        minWidth: 100,
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
        minWidth: 200,
        flex: 2,
        renderCell: (param) => (
          <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
            {param.formattedValue}
          </p>
        ),
      },
  
      {
        field: "plan",
        headerName: "Plan",
        minWidth: 100,
        flex: 2,
        renderCell: (param) => (
          <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
            {param.formattedValue}
          </p>
        ),
      },
      {
        field: "agents",
        headerName: "Agents",
        minWidth: 100,
        flex: 2,
        renderCell: (param) => (
          <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
            {param.formattedValue}
          </p>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 100,
        flex: 2,
        renderCell: (param) => (
          
          <div className={`hover:cursor-pointer w-full flex py-1 px-1 
          rounded-3xl justify-center items-center
           ${(param.row.is_trial_active && param.row.is_trial_expired)
             ||(!param.row.is_trial_active && param.row.is_subscription_expired) ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600 '}`}>
            {
           param.row.is_trial_active && param.row.is_trial_expired ? "Finished" :
           !param.row.is_trial_active && param.row.is_subscription_expired ? "Finished" :
           "Active"
            
            
            }
          </div>
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
                <MenuItem onClick={() => handleMenuOptionClick('Payment')}>
                    <div className='flex  justify-center items-center gap-4'>
                        <MdPayment/>
                        Payment history
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
        // Check if the "name" field of the current row is "karim"
        if (!params.row.is_active) {
          return 'bg-red-100'; // Apply Tailwind class for red-colored rows
        }
        return ''; // Apply Tailwind class for red-colored rows
      };
    return (
      <div className='px-10 py-6 w-full '>
        
          <div className='rounded-2xl animate-slideup  w-full h-[500px] px-2 py-2 shadow-[0_5px_16px_0px_rgba(0,0,0,0.1)] mt-4'
  >
          <DataGrid
              columns={columns}
              rows={owners}
              getRowId={(row) => row.id}
              
              
               pageSize={7}
    
              {...owners}
              initialState={{
                ...owners.initialState,
                pagination: { paginationModel: { pageSize: 7 } },
              }}
  
              getRowClassName={getRowClassName}
           
              pageSizeOptions={[7]}    
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
         <PopUp_BlockOwner 
                    setShowPopup={setShowPopup}
                    ownerSelect={ownerSelect}
                    setOwners={setOwners}
                    owners={owners}
                    type = {type}
                    />

        </div>
      )
      
      
      
      }
  
      </div>

      
    )
}

export default Owner