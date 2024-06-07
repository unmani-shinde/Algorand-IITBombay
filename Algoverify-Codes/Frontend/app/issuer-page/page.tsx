"use client"

import { FileUpload } from "./components/fileupload"
import { useState,useEffect } from "react"
import { Label,TextInput } from "flowbite-react"
import DataHeaders from "./components/dataheaders"
import pinFiletoIPFS from "./components/pinFiletoIFPS"
import ExportCSV from "../verifier-page/components/verifyCSV"
// bg-gradient-to-b from-cyan-400 to-cyan-100 dark:bg-gradient-to-b dark:from-cyan-900 dark:to-cyan-500 

function Issuer() {
    const [fileUploaded,setFile] = useState<File>()
    const [university,setUniversity] = useState<String>("")
    const [SCID,setSCID] = useState<String>("")
   
    const handleFileChange = (event:any) => {
        setFile(event.target.files[0]);
      };
      const new_CID = "Qmb6VRZ8xyUgVTYSyNukMgEMVZEZTHCCFewTq5MqfcgRn6"
      useEffect(() => {
        setSCID("QmbSNjK5gDF2mAaqzXNsVAGL37PWVPuK6MQWAkF7xv1Gm6");
      }, []);
    
      const handleClick = async () => {
        console.log("File Name: ",fileUploaded?.name)


        let fileBlob = new Blob([fileUploaded as BlobPart]);
        const formData = new FormData();
        formData.append('file', fileBlob);

      try {
        const response = await fetch('http://127.0.0.1:5000/issuer-page', {
          method: 'POST',
          body: formData,
          
        });

        if (response.ok) {
          const data = await response.json();
          const csvString = convertJsonToCsv(data);
          const blob = new Blob([csvString], { type: 'text/csv' });
          const university_hash = await pinFiletoIPFS(blob)
          let scidCSV = await ExportCSV(SCID)
          fileBlob = new Blob([scidCSV as BlobPart]);

        const requestFormData = new FormData()
        requestFormData.append('scid_database',fileBlob)

        try {
          const response = await fetch(`http://127.0.0.1:5000/dun-dun-dun?university=${university}&ucid=${university_hash}`,{
            method: 'POST',
            body: requestFormData,
            
          })
          if(response.ok){
            const data = await response.json();
            const csvString = convertJsonToCsv(data);
            const blob = new Blob([csvString], { type: 'text/csv' });
            const new_SCID = await pinFiletoIPFS(blob)
            setSCID(new_SCID) 
          }
          else{

            console.log(response);
            
          }
          
        } catch (error) {
          
        }

          


        } else {
          console.error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error:', error);
      }

      





    };

    function convertJsonToCsv(jsonData:any) {
        const header = Object.keys(jsonData[0]).join(',') + '\n';
        const rows = jsonData.map((obj:any) => Object.values(obj).join(',')).join('\n');
        return header + rows;
    }
    
    
    return(
        <section style={{marginBottom:'-3vh'}} className="w-full flex items-center flex-col flex-grow pt-10 ">
    <div className="items-center py-8 px-4 mx-auto w-full text-center lg:py-16 lg:px-12">

    <div className="flex flex-col mb-4 block items-center w-full ">
          <Label className='text-white font-semibold' htmlFor="university" value="Enter the name of your University: " />
          <TextInput onChange={(e)=>{setUniversity(e.target.value)}} className="w-7/12" id="university" type="university" placeholder="XYZ University" required shadow />
        
        </div>
        
      
        <DataHeaders/>
    
        
       
        <FileUpload onFileChange={handleFileChange}/>
        
        <div className="flex flex-col mt-5 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
           
            <a
                
                style={{border:'none'}}
                onClick={handleClick}
                className="btn bg-indigo-700 rounded-md  text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Let's Get Started!
              </a>
        </div>

        <p
                
                style={{border:'none',cursor:'pointer'}}
                onClick={()=>{console.log("Hello");
                }}
                className=" text-sm font-semibold text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Want to update an existing record? <a style={{textDecoration:'underline'}}className="font-bold hover:text-indigo-500" href="/update-page">CLICK HERE</a> ↗
              </p>
        
    </div>
</section>
    )    
}

export default Issuer