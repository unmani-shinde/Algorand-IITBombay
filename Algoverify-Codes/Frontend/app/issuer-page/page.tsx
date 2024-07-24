"use client"

import { FileUpload } from "./components/fileupload"
import { useState,useEffect ,useRef} from "react"
import { Label,TextInput } from "flowbite-react"
import DataHeaders from "./components/dataheaders"
import pinFiletoIPFS from "./components/pinFiletoIFPS"
import ExportCSV from "../verifier-page/components/verifyCSV"
import deleteFromIPFS from "../components/deleteFromIPFS"
import algosdk from 'algosdk';
import * as abi from '../contracts/artifacts/contract.json';
import Papa from 'papaparse';
const fs = require('fs').promises;
const path = require('path');

// bg-gradient-to-b from-cyan-400 to-cyan-100 dark:bg-gradient-to-b dark:from-cyan-900 dark:to-cyan-500
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
const appIndex = Number(process.env.NEXT_PUBLIC_ALGO_APP_ID);

function Issuer() {
    const [fileUploaded,setFile] = useState<File>()
    const [university,setUniversity] = useState<string>("")
    const [globalState, setGlobalState] = useState<any>(null);
    const methodArg = useRef('')
    const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);
    let new_SCID = ""
    const [modalMessage, setModalMessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [fadeIn, setFadeIn] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [txID, setTxId] = useState<String>('');
    const [gradYears, setGradYears] = useState<string[]>([]);
    const [UCID, setUCID] = useState<string>("");

    useEffect(() => {
      const initialize = async () => {
        const mnemonic = process.env.NEXT_PUBLIC_ALGO_MNEMONIC as string;
        const addr = process.env.NEXT_PUBLIC_ALGO_ADDR as string;
        const recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);
        setAccount({
          addr: addr,
          sk: recoveredAccount.sk
        });
        const accountInfo = await algodClient.accountInformation(addr).do();
        console.log('\nBalance:', accountInfo.amount / 1000000, 'Algos')
        await readGlobalState();
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
      if (methodArg.current == "" || methodArg.current == " " || methodArg.current == "-1") {
        console.log("methodArg empty:", methodArg.current);
        return;
      }
      
      const suggestedParams = await algodClient.getTransactionParams().do();
      const atc = new algosdk.AtomicTransactionComposer();
  
      const contract = new algosdk.ABIContract(abi);
      const updateMethod = algosdk.getMethodByName(contract.methods, 'update_SCID');
  
      atc.addMethodCall({
        appID: appIndex,
        method: updateMethod,
        methodArgs: [methodArg.current], // Use the state value as the method argument
        sender: account.addr,
        suggestedParams,
        signer: async (unsignedTxns) => unsignedTxns.map((t) => t.signTxn(account.sk)),
      });
  
      try {
        const result = await atc.execute(algodClient, 3);
        console.log('\nSCID updated!\n');
  
        // Log transaction IDs
        const transactionID = result.txIDs[0];
        console.log(`Transaction ID: ${transactionID}`);
        setTxId(transactionID);
        //await updateTransactions();
  
        await readGlobalState();
      } catch (error) {
        console.error('Failed to update SCID:', error);
      }
    };

    useEffect(() => {
      if (UCID && txID) {
        updateTransactions();
      }
    }, [UCID, txID]);

    // Read the TCID from chain
    const readTCID = async () => {
      try {
          const appInfo = await algodClient.getApplicationByID(appIndex).do();
          const globalState = appInfo.params['global-state'];
          const tcidState = globalState.find(
              (item: { key: string, value: { bytes: string, type: number, uint: number } }) => {
                  const key = Buffer.from(item.key, 'base64').toString('utf8');
                  return key === 'TCID';
              }
          );
          if (tcidState && tcidState.value.type === 1) {
              const value = Buffer.from(tcidState.value.bytes, 'base64').toString('utf8');
              console.log('TCID Value:', value);
              return value;
          }
      } catch (error) {
          console.error('Failed to read TCID:', error);
      }
      return null;
    };
  

    // Write the TCID to algorand
    const writeTCID = async (tcid: string) => {
      if (!account) return;
      
      const suggestedParams = await algodClient.getTransactionParams().do();
      const atc = new algosdk.AtomicTransactionComposer();
  
      const contract = new algosdk.ABIContract(abi);
      const updateMethod = algosdk.getMethodByName(contract.methods, 'update_TCID');
  
      atc.addMethodCall({
        appID: appIndex,
        method: updateMethod,
        methodArgs: [tcid], // Use the state value as the method argument
        sender: account.addr,
        suggestedParams,
        signer: async (unsignedTxns) => unsignedTxns.map((t) => t.signTxn(account.sk)),
      });
  
      try {
        const result = await atc.execute(algodClient, 3);
        console.log('\nTCID updated!\n');
  
        // Log transaction IDs
        const transactionID = result.txIDs[0];
        console.log(`Transaction ID: ${transactionID}`);
        //setTxId(transactionID);
        //await updateTransactions();
  
        //await readGlobalState();
      } catch (error) {
        console.error('Failed to update TCID:', error);
      }
    }

    const updateTransactions = async () => {
      const oldTCID = await readTCID();
      if (!oldTCID) {
        console.log("readTCID error");
        return;
      }
      console.log(`oldTCID = ${oldTCID}`);
      //use ExportCSV to fetch Transactions.csv from TCID
      const transactionsBlob = await ExportCSV(oldTCID);
      //add UCID, Graduation Year, TxID to TCID table
      let csvText = "";
      if (transactionsBlob) {
        csvText = await transactionsBlob.text();
      }
      let updatedCsvText = csvText.trim();
      console.log(updatedCsvText);
      gradYears.forEach( async (element: any) => {
        console.log(`UCID = ${UCID} and txID = ${txID}\n`)
        updatedCsvText += `\n${UCID},${element},${txID}`;
      });
      
      const newTransactionsBlob = new Blob([updatedCsvText], { type: 'text/csv' });
      //delete oldTCID from ipfs
      await deleteFromIPFS(oldTCID);
      //pin new transactions.csv
      const newTCID = await pinFiletoIPFS(newTransactionsBlob, "Transactions.csv");
      //store new TCID value in TCID.txt
      await writeTCID(newTCID);
      console.log("TCID updated.");
    };

    /////////////////////////////   smart contract stuff^   /////////////////////////////
    //// initialise useeffect -> loads account, checks balance, loads latest SCID value
    ////
    //// use readGlobalState() to fetch SCID value from the smart contract -> SCID value will be updated in globalState
    //// 
    //// to update value: methodArg.current = <new SCID val> and then
    //// use callUpdateSCID() to upload SCID value to the smart contract -> SCID value will be updated to methodArg.current value
    ////
    //// readTCID() to read TCID and writeTCID() to update TCID value on smart contract
    ////

    useEffect(() => {
      if (showModal) {
        setTimeout(() => setFadeIn(true), 0);
      } else {
        setFadeIn(false);
      }
    }, [showModal]);

    const parseCSV = (file: File) => {
      Papa.parse(file, {
        header: true,
        complete: (results: { data: any }) => {
          const rows = results.data;
          const uniqueYears = new Set<string>(); // Use a Set to store unique years
  
          // Iterate over each row and add the graduation year to the set
          rows.forEach((row: { [x: string]: string }) => {
            if (row['Graduation Year']) {
              uniqueYears.add(row['Graduation Year'].trim()); // Trim to remove any extraneous whitespace
            }
          });
  
          // Convert Set to Array and update state
          setGradYears(Array.from(uniqueYears));
        }
      });
    };

    const handleFileChange = (event:any) => {
        setFile(event.target.files[0]);
        parseCSV(event.target.files[0]);
      };

    //const new_CID = globalState
    useEffect(() => {
      (async () => {
        await readGlobalState();
      })
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
          console.log(globalState,typeof(globalState));
          
          const data = await response.json();
          const csvString = convertJsonToCsv(data);
          const blob = new Blob([csvString], { type: 'text/csv' });
          const university_hash = await pinFiletoIPFS(blob,university)
          setUCID(university_hash);

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
              if (data.cid == "-1") {
                console.log("hdfajfhadkjfhdakj", data.cid);
                return;
              }
              const csvString = convertJsonToCsv(data);
              const blob = new Blob([csvString], { type: 'text/csv' });
              let oldSCID = globalState;
              new_SCID = await pinFiletoIPFS(blob,"UCID_Map.csv")
              console.log("setmethodarg = new_scid = ", new_SCID);
              methodArg.current = new_SCID
              console.log("methodArg izegal to: ", methodArg);
              await callUpdateSCID();
              await deleteFromIPFS(oldSCID);
              setIsSuccess(true);
              setModalMessage(`University data has been uploaded successfully.`);
              setShowModal(true);
            }
            else{
              console.log(response);
            }
          } catch (error) {
            console.log("dundundun error:", error);
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

    <div className="flex flex-col mb-4 items-center w-full ">
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

          {showModal && (
            <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="relative p-4 w-full max-w-5xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setShowModal(false)}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{modalMessage}</h3>
                    <button onClick={() => setShowModal(false)} type="button" className={`text-white ${isSuccess ? 'bg-green-600 hover:bg-green-800 focus:ring-green-300 dark:focus:ring-green-800' : 'bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800'} font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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