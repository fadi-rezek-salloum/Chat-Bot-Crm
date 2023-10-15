
import React , {   useState  , useMemo} from 'react'
import {AiOutlineCloudDownload} from 'react-icons/ai'
import { DataGrid    } from "@mui/x-data-grid";

const PaymentC = ({payments , setPayments , setPaymentsorignal}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);



  function formatDateToShort(dateString) {
    if (!dateString) {
      return ''; 
    }
  
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

const columns =useMemo(()=> [
  {
    field: "transaction_id",
    headerName: "Operation ID",
    minWidth: 200,
    flex: 2,
    headerClassName: "super-app-theme--header",
    renderCell: (param) => (
      <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
            {param.row.payment.transaction_id}
      </p>
    ),
  },

  {
      field: "amount",
      headerName: "Amount",
      minWidth: 150,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
              {param.row.payment.amount}
        </p>
      ),
    },

    {
      field: "payment_method",
      headerName: "Payment method",
      minWidth: 150,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
           {param.row.payment.payment_method}
        </p>
      ),
    },
  

    {
      field: "name",
      headerName: "Pricing plan",
      minWidth: 150,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
        {param.row.plan.name}
        </p>
      ),
    },

  

    {
      field: "created_at",
      headerName: "Payment date",
      minWidth: 200,
      flex: 2,
      renderCell: (param) => (
        <p className=" hover:cursor-pointer w-full flex justify-start items-center ">
         
          {formatDateToShort(param.formattedValue)}
        </p>
      ),
    },



  
  
  ],
    [anchorEl, selectedRow])
  
  return (
    <div className='px-10 py-6 sm:mt-0 mt-20 animate-slideup'>
      
        <div className='rounded-2xl  h-[500px]  w-full  px-2 py-2 shadow-[0_5px_16px_0px_rgba(0,0,0,0.1)] mt-4'
>
        <DataGrid
            columns={columns}
            rows={payments}
            getRowId={(row) => row.id}
            
            
             pageSize={7}
  
            {...payments}
            initialState={{
              ...payments.initialState,
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
  
  

    </div>
  )
}

export default PaymentC