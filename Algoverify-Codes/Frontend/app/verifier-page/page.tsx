"use client";

import React, { useState, useEffect, useRef } from 'react';
import ExportCSV from './components/verifyCSV';
import StudentDetailsForm from './components/studentdetails';
import algosdk from 'algosdk';
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
const appIndex = Number(process.env.NEXT_PUBLIC_ALGO_APP_ID);

interface FormData {
  student_name: string;
  university: string;
  student_SID: string;
  student_grad_year: string;
}

const VerifierPage: React.FC = () => {
  const [formData_, setFormData_] = useState<FormData>({ student_name: '', university: '', student_SID: '', student_grad_year: '' });
  const [modalMessage, setModalMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [SCID,setSCID] = useState<String>("")
  const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);

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
    let value: String | null = null;
    if (scidState && scidState.value.type === 1) {
      value = Buffer.from(scidState.value.bytes, 'base64').toString('utf8');
    }
    if (value) setSCID(value);
    else setSCID("");
    console.log('SCID Value:', value);
  };

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

  /////////////////////////////   smart contract stuff^   /////////////////////////////
  //// initialise useeffect -> loads account, checks balance, loads latest SCID value
  ////
  //// use readGlobalState() to fetch SCID value from the smart contract -> SCID value will be updated in globalState
  //// 
  //// to update value: methodArg.current = <new SCID val> and then
  //// use callUpdateSCID() to upload SCID value to the smart contract -> SCID value will be updated to methodArg.current value
  ////
  //// TODO: retrieve TCID, retrieve TxID using UCID and Graduation Year from Transactions.csv on pinata, check timestamp of tx and verify it. 
  ////

  useEffect(() => {
    if (showModal) {
      setTimeout(() => setFadeIn(true), 0);
    } else {
      setFadeIn(false);
    }
  }, [showModal]);
  
  const fetchUniversityCID = async() =>{
    const blob = await ExportCSV(SCID);
    let superTable = new Blob([blob as BlobPart]);
    const formData = new FormData();
    formData.append('super_database', superTable, 'data.csv');

    const res = await fetch(`http://127.0.0.1:5000/get-uni-cid?university=${formData_.university}`, {
      method: 'POST',
      body: formData,
      
      
    });

    if (!res.ok) {
      throw new Error('I failed');
    }

    const data = await res.json();
    const text_res = data.cid;
    console.log('University CID:',text_res);

    return text_res

  }

  const fetchCSV = async () => {
    
    try {
      const UCID = await fetchUniversityCID();

      // Create a Blob object from the formatted CSV string
      const blob = await ExportCSV(UCID)
      let fileBlob = new Blob([blob as BlobPart]);

      // Create a FormData object and append the Blob to it
      const formData = new FormData();
      formData.append('database', fileBlob, 'data.csv');

      // Now you can send the FormData object to the server using fetch
      const verificationResponse = await fetch(`http://127.0.0.1:5000/verifier-page?student_name=${formData_.student_name}&student_SID=${formData_.student_SID}&student_grad_year=${formData_.student_grad_year}`, {
        method: 'POST',
        body: formData,
        mode:'cors'
       
      });

      if (!verificationResponse.ok) {
        throw new Error('Verification failed');
      }

      const jsonResponse = await verificationResponse.json();
      console.log('Verification response:', jsonResponse);
      if (!jsonResponse.verified) {
        setIsSuccess(false);
        setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, could not be verified.`);
        setShowModal(true);
        return;
      }
      //TODO: 
      //retrieve TCID
      const TCID = await readTCID();
      if (!TCID) {
        console.error("read_tcid error");
        return;
      }
      //retrieve UCID and grad year of that particular student
      const grad_year = formData_.student_grad_year;
      //retrieve TxID using UCID and Graduation Year from Transactions.csv on pinata
      const txBlob = await ExportCSV(TCID)
      if (!txBlob) {
        console.error("exportcsv txblob error");
        return;
      }
      const csvText = await txBlob.text();
      const lines = csvText.split('\n');
      let txID;
      for (let i = 1; i < lines.length; i++) {
        const [csvUCID, csvGradYear, csvTxID] = lines[i].split(',');
        
        // Trim whitespace and compare
        if (csvUCID.trim() === UCID.trim() && csvGradYear.trim() === grad_year.trim()) {
          txID = csvTxID
        }
      }

      if (!txID) {
        console.error("Transaction ID not found");
        return;
      }

      //CHATGPT IMPLEMENT THIS: check timestamp of txID, especially the year and verify if the tx year is within +-1 of the grad_year. 
      const transaction = await algodClient.pendingTransactionInformation(txID).do();
      const round = transaction['confirmed-round'];
      if (!round) {
        console.log('Transaction not confirmed yet');
        return;
      }
      const block = await algodClient.block(round).do();
      const timestamp = block.block.ts; // Timestamp in seconds since epoch
      const txYear = new Date(timestamp * 1000).getFullYear();
      const gradYearInt = parseInt(grad_year);

      if (Math.abs(txYear - gradYearInt) <= 1) {
        setIsSuccess(true);
        setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, has been successfully verified.\nRecord added on: ${new Date(timestamp * 1000).toLocaleString()}`);
      } else {
        setIsSuccess(false);
        setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, has been successfully verified. However the data records might have been tampered with.\nRecord added on: ${new Date(timestamp * 1000).toLocaleString()}, which is too recent for a student that graduated in ${grad_year}`);
      }
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch CSV:', error);
      setIsSuccess(false);
      setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, could not be verified.`);
      setShowModal(true);
    }
  };

  const handleVerify = async () => {
    await fetchCSV();
  };

  return (
    <section style={{ marginBottom: '-3vh' }} className="bg-gradient-to-b from-grey-900 to-indigo-100 w-full flex items-center flex-col flex-grow pt-20 ">
      <div className="py-8 px-4 mx-auto w-full text-center lg:py-16 lg:px-12">
        <StudentDetailsForm formData={formData_} setFormData={setFormData_} />
        <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" onClick={handleVerify} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Verify Student Details
        </button>

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
    </section>
  );
};

export default VerifierPage;
