"use client"

import { FileUpload } from "./components/fileupload"
import { useState,useEffect } from "react"
import DataHeaders from "./components/dataheaders"
import pinFiletoIPFS from "./components/pinFiletoIFPS"
// bg-gradient-to-b from-cyan-400 to-cyan-100 dark:bg-gradient-to-b dark:from-cyan-900 dark:to-cyan-500 

function Issuer() {
    const [fileUploaded,setFile] = useState<File>()
    const handleFileChange = (event:any) => {
        setFile(event.target.files[0]);
      };
    
      const handleClick = async () => {
        console.log("File Name: ",fileUploaded?.name);
        const fileBlob = new Blob([fileUploaded as BlobPart]);
        const formData = new FormData();
        formData.append('file', fileBlob);

      try {
        const response = await fetch('http://127.0.0.1:5000/issuer-page', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Database:', data);
          // Convert JSON to CSV string
    const csvString = convertJsonToCsv(data);
    const blob = new Blob([csvString], { type: 'text/csv' });
    await pinFiletoIPFS(blob)


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
    <div className="py-8 px-4 mx-auto w-full text-center lg:py-16 lg:px-12">
        <DataHeaders/>
    
        
       
        <FileUpload onFileChange={handleFileChange}/>
        
        <div className="flex flex-col mt-5 mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
           
            <a
                
                style={{border:'none'}}
                onClick={handleClick}
                className="btn bg-indigo-700 rounded-md  text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Let's Get Started!
              </a>

           
        </div>
        
    </div>
</section>
    )    
}

export default Issuer