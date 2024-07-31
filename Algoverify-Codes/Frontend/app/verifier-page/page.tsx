"use client";

import React, { useState, useEffect } from 'react';
import ExportCSV from './components/verifyCSV';
import StudentDetailsForm from './components/studentdetails';
import algosdk from 'algosdk';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const indexerClient = new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', '');
const appIndex = Number(process.env.NEXT_PUBLIC_ALGO_APP_ID);

interface FormData {
  student_name: string;
  university: string;
  student_SID: string;
  student_grad_year: string;
  txID: string;
}

const VerifierPage: React.FC = () => {
  const [formData_, setFormData_] = useState<FormData>({ student_name: '', university: '', student_SID: '', student_grad_year: '', txID: ''});
  const [modalMessage, setModalMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => setFadeIn(true), 0);
    } else {
      setFadeIn(false);
    }
  }, [showModal]);

  const fetchUniversityCID = async () => {
    try {
      // Fetch the transaction info
      const txInfo = await indexerClient.lookupTransactionByID(formData_.txID).do();
      
      // Get the global state delta
      const globalStateDelta = txInfo['transaction']['global-state-delta'][0];
      
      // Decode the value
      const value = Buffer.from(globalStateDelta['value']['bytes'], 'base64').toString('utf8');
      
      return value;
  } catch (error) {
      console.error(`Error fetching with Indexer: ${error}`);
      return null;
  }
  };

  const getTransactionTimestamp = async () => {
    try {
      // Search for the transaction using the Indexer
      const txInfo = await indexerClient.lookupTransactionByID(formData_.txID).do();

      if (!txInfo || !txInfo.transaction) {
        console.log('Transaction not found');
        return null;
      }

      const roundNumber = txInfo.transaction['confirmed-round'];
      
      // Get the block information for the round where the transaction was confirmed
      const blockInfo = await indexerClient.lookupBlock(roundNumber).do();

      if (!blockInfo || !blockInfo.timestamp) {
        console.log('Block information not found');
        return null;
      }

      return blockInfo.timestamp;

    } catch (error) {
      console.error('Error fetching transaction information:', error);
      return null;
    }
  };

  const fetchCSV = async () => {
    try {
      //fetch UCID from transaction's global state
      const UCID = await fetchUniversityCID();
      if (!UCID) {
        console.error("Transaction ID not found");
        setIsSuccess(false);
        setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, could not be verified. Transaction ID not found.`);
        setShowModal(true);
        return;
      }

      const blob = await ExportCSV(UCID);
      let fileBlob = new Blob([blob as BlobPart]);

      const formData = new FormData();
      formData.append('database', fileBlob, 'data.csv');

      const verificationResponse = await fetch(`http://127.0.0.1:5000/verifier-page?student_name=${formData_.student_name}&student_SID=${formData_.student_SID}&student_grad_year=${formData_.student_grad_year}`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
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

      const timestamp = await getTransactionTimestamp();
      if (!timestamp) {
        console.error("Failed to retrieve transaction timestamp");
        setIsSuccess(false);
        setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, could not be verified. Failed to retrieve transaction timestamp.`);
        setShowModal(true);
        return;
      }
      
      //// SUCCESS ////
      setIsSuccess(true);
      setModalMessage(`Student ${formData_.student_name} from ${formData_.university}, graduating in ${formData_.student_grad_year}, has been successfully verified.\nRecord added on: ${new Date(timestamp * 1000).toLocaleString()}`);
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
        <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" onClick={handleVerify} className="text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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