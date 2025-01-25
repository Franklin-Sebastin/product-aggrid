"use client"
import React, {  useState,useEffect, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'; 
import { AllCommunityModule, ModuleRegistry,themeQuartz,colorSchemeLightCold } from 'ag-grid-community'; 
import axios from 'axios';
import styles from '@/app/page.module.css'

ModuleRegistry.registerModules([AllCommunityModule]);

const DataList = () => {
    const [rowData,setRowData]=useState([]);
    const [gridApi,setGridApi] = useState(null);
    const [quickFilter,setQuickFilter]=useState(null);
    
    const [colDefs]=useState([
        {field:"id"},
        {field: "brand"},
        {field:"name",headerName:"Product Name",flex:1.5},
        {field:"price", 
            valueFormatter: (params) =>
                params.value ? `$${(params.value).toLocaleString()}` : "N/A",
        },
        {field:"category"},
        {field:"tag_list",headerName:"Tags",flex:2,
            cellRenderer: (params) =>params.value.join(", ") || "N/A"},
        {field: "actions", filter:false,sortable:false,
            cellRenderer: (params) => {
                return (
                    <button className={styles.button} 
                      onClick={() => {
                        const productDetails = JSON.stringify(params.data, null, 2);
                        alert(`Product Details:\n${productDetails}`);
                      }}
                    >
                      View
                    </button>
                );
            },
            
        },
    ]);
    const defaultColDef = useMemo(() => {
        return {
          filter: "agTextColumnFilter",
          floatingFilter: true,
          flex: 1,
        };
      }, []);
  

    useEffect(()=>{
        const fetchData=async()=>{
            try{
            const response=await axios.get("https://makeup-api.herokuapp.com/api/v1/products.json");
            setRowData (response.data);
        }catch(error){
            console.error("Error fetching data:", error);
           
        }

    };
        fetchData();
    },[]);

    const onGridReady = (params) => {
        setGridApi(params.api);
      };

     const onExportClick = () => {
            gridApi.exportDataAsCsv(); 
      };

      const myTheme=themeQuartz.withPart(colorSchemeLightCold);
     

    return(
        <div  style={{ height: "100vh", width: "100%" ,overflow:"hidden"}}>
            <div className={styles.heading}>
                <h2>Product List</h2>
                <input type="text" placeholder="Search..." onChange={(e)=>setQuickFilter(e.target.value)} />
                <button onClick={onExportClick}>Export to CSV</button>
            </div>

            <AgGridReact 
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilter}
            onGridReady={onGridReady}
            pagination={true} 
            paginationPageSizeSelector={false}
            paginationPageSize={50}
            theme={myTheme} /> 
        
            </div>
        );
}
    

export default DataList
