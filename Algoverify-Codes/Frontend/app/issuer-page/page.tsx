"use client"

import { FileUpload } from "./components/fileupload"
import { useState,useEffect } from "react"
import { Label,TextInput } from "flowbite-react"
import DataHeaders from "./components/dataheaders"
import pinFiletoIPFS from "./components/pinFiletoIFPS"
import ExportCSV from "../verifier-page/components/verifyCSV"
import algosdk from 'algosdk';
import * as abi from './artifacts/contract.json';
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
const appIndex = 678299449;
// bg-gradient-to-b from-cyan-400 to-cyan-100 dark:bg-gradient-to-b dark:from-cyan-900 dark:to-cyan-500 

function Issuer() {
    const [fileUploaded,setFile] = useState<File>()
    const [university,setUniversity] = useState<String>("")
    const [SCID,setSCID] = useState<String>("")
    const [globalState, setGlobalState] = useState<any>(null);
    const [methodArg, setMethodArg] = useState<string>('');
    const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);

    useEffect(() => {
      const initialize = async () => {
        // Define the mnemonic and address
        const mnemonic = process.env.NEXT_PUBLIC_ALGO_MNEMONIC as string;
        const addr = process.env.NEXT_PUBLIC_ALGO_ADDR as string;
  
        // Recover the account from the mnemonic
        const recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);
  
        // Set the account
        setAccount({
          addr: addr,
          sk: recoveredAccount.sk
        });
  
        // Log the mnemonic and address (for verification purposes)
        //console.log('\nMnemonic:', mnemonic);
        //console.log('\nAddress:', addr);
  
        // Wait for account to be funded
        //await waitForFunding(addr);
  
        // Get account balance
        const accountInfo = await algodClient.accountInformation(addr).do();
        console.log('\nBalance:', accountInfo.amount / 1000000, 'Algos')
        //setBalance(accountInfo.amount / 1000000);
      };
  
      initialize();
    }, []);

    const readGlobalState = async () => {
      const appInfo = await algodClient.getApplicationByID(appIndex).do();
      const globalState = appInfo.params['global-state'];
  
      const scidState = globalState.find(
        (item: { key: string, value: { bytes: string, type: number, uint: number } }) => {
          const key = Buffer.from(item.key, 'base64').toString('utf8');
          return key === 'SCID';
        }
      );
  
      let value: string | null = null;
      if (scidState && scidState.value.type === 1) {
        value = Buffer.from(scidState.value.bytes, 'base64').toString('utf8');
      }
  
      setGlobalState(value);
      console.log('SCID Value:', value);
    };

    const callUpdateSCID = async () => {
      if (!account) return;
      
      const suggestedParams = await algodClient.getTransactionParams().do();
      const atc = new algosdk.AtomicTransactionComposer();
  
      const contract = new algosdk.ABIContract(abi);
      const updateMethod = algosdk.getMethodByName(contract.methods, 'update_SCID');
  
      atc.addMethodCall({
        appID: appIndex,
        method: updateMethod,
        methodArgs: [methodArg], // Use the state value as the method argument
        sender: account.addr,
        suggestedParams,
        signer: async (unsignedTxns) => unsignedTxns.map((t) => t.signTxn(account.sk)),
      });
  
      await atc.execute(algodClient, 3);
      console.log('\nSCID updated!\n',);
      handleRead();
    };

    const handleRead = async () => {
      await readGlobalState();
    };

    const handleUpdate = async () => {
      await callUpdateSCID();
    };

    const handleFileChange = (event:any) => {
        setFile(event.target.files[0]);
      };
      //const new_CID = globalState
      useEffect(() => {
        handleRead();
        setSCID(globalState);
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
          const university_hash = await pinFiletoIPFS(blob) //UCID
          // setMethodArg(new_SCID);
          // handleUpdate();
          
          let scidCSV = await ExportCSV(globalState) 
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
            setMethodArg(new_SCID);
            handleUpdate();
            //setSCID(new_SCID) 
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