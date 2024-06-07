"use client"
import { Label,TextInput,Button, Checkbox} from "flowbite-react"
import { useState,useEffect } from "react"
import { HiOutlinePlusCircle } from "react-icons/hi";

function DataHeaders() {

    const [dataHeaders, setDataHeaders] = useState<String[]>(["SID","First Name","Middle Name","Last Name"]);
    const [headerName,setHeaderName] = useState<String>("")
    const [takeMultipleHeaders,setTakeMultipleHeaders] = useState<boolean>(false)
    
    
    return(
        <div className="mt-4 flex flex-col items-center">
            <div className="flex flex-col items-center">
        <div className="mb-2 flex flex-col items-center">
        <Label className="text-white font-semibold" htmlFor="file-upload-helper-text" value="Enter the Data Headers (in the sequence they appear in the data)" />
        <Label className="text-gray-500 mb-2" htmlFor="file-upload-helper-text" value="Mandatory Fields - Student University ID (SID), First Name, Middle Name, Last Name. Make sure that the first 4 fields of the data to be uploaded are these fields." />
        <div className="flex items-center gap-2 mb-2">
        <Checkbox onChange={(e)=>{setTakeMultipleHeaders(!takeMultipleHeaders)}} id="promotion" />
        <Label className='text-white' htmlFor="multiple-headers">Enter Multiple Headers ('Semi-colon separated')</Label>
      </div>
        
        <div className="flex flex-row w-full">
        <TextInput  onChange={(e)=>{setHeaderName(e.target.value)}} className="w-8/12" type="text"placeholder="Enter Header" />
        <Button 
  style={{ cursor: 'pointer' }} 
  className="pt-1 hover:bg-indigo-300 ml-3 w-3/12 align-middle bg-indigo-700 rounded-md text-sm font-semibold text-white shadow-sm hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
  onClick={() => {
    if (takeMultipleHeaders) {
      const headers = headerName.split(';');
      setDataHeaders([...dataHeaders, ...headers]);
    } else {
      setDataHeaders([...dataHeaders, headerName]);
    }
    setHeaderName("");
  }}
  disabled={headerName.length === 0}
>
  <span className="flex flex-row">Add Header <HiOutlinePlusCircle style={{ transform: 'scale(2)', paddingTop: '0.5vh', paddingLeft: '0.75vh' }} /></span>
</Button>





        </div>

        {dataHeaders.length > 4 && (
  <div className="w-full mt-2">
    <span ><b>List of Headers so far:</b> {dataHeaders.join(", ")}</span>
  </div>
)}
        
      </div>
      
    </div>



        </div>
    
    )
    
}

export default DataHeaders