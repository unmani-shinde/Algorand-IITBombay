"use client"
import { useState } from "react"
import { TextInput, Label } from "flowbite-react"
import {FileUpload }from "../issuer-page/components/fileupload"
export default function UpdatePage() {
    const [fileUploaded,setFile] = useState<File>()
    const handleFileChange = (event:any) => {
        setFile(event.target.files[0]);
      };
    
    return(
        <section style={{marginBottom:'-3vh'}} className="w-full flex items-center flex-col flex-grow pt-10 ">
    <div className="py-8 px-4 mx-auto w-full text-center lg:py-16 lg:px-12">
    <div className="w-full flex items-center flex-col flex-grow pt-10 mb-10 ">
        <div className="mb-2 block ">
          <Label className='text-white font-semibold' htmlFor="university" value="Enter the name of your University (in the form it exists in the Semi-Private Database)" />
        </div>
        <TextInput className="w-7/12" id="university" type="university" placeholder="XYZ University" required shadow />
      </div>
        <FileUpload onFileChange={handleFileChange}/>

        <a
                
                style={{border:'none',cursor:'pointer'}}
                onClick={()=>{console.log("Hello");
                }}
                className="mt-4 btn bg-indigo-700 rounded-md  text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Update Records!
              </a>

              <p
                
                style={{border:'none',cursor:'pointer'}}
                onClick={()=>{console.log("Hello");
                }}
                className="mt-5 text-sm font-semibold text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Don't have an existing university record? <a style={{textDecoration:'underline'}}className="font-bold hover:text-indigo-500" href="/issuer-page">CREATE ONE NOW</a> ↗
              </p>

        
        </div></section>

    )
    
}