"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Modal } from "flowbite-react";
import algosdk from 'algosdk';
import * as abi from "../../../Backend/contracts/artifacts/contract.json";
import Papa from 'papaparse';
import IssuerForm from "./components/issueForm";
import { FileUpload } from "./components/fileupload";
import pinFiletoIPFS from "./components/pinFiletoIFPS";
import ExportCSV from "../verifier-page/components/verifyCSV";

interface TxnParams {
  txnID: string;
}

export function TransactionModal({ txnID }: TxnParams) {
  const [openModal, setOpenModal] = useState(true);

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Transaction Details: Success!</Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Your records have been successfully updated with the unique content identifier {txnID}.
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            To access the records uploaded in this instance, use the above ID. This ID will not be shown again.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpenModal(false)}>I accept</Button>
      </Modal.Footer>
    </Modal>
  );
}

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
const appIndex = Number(process.env.NEXT_PUBLIC_ALGO_APP_ID);

export const convertJsonToCsv = (jsonData: any) => {
  const header = Object.keys(jsonData[0]).join(',') + '\n';
  const rows = jsonData.map((obj: any) => Object.values(obj).join(',')).join('\n');
  return header + rows;
};

export const parseCSV = (file: File, setGradYears: React.Dispatch<React.SetStateAction<string[]>>) => {
  Papa.parse(file, {
    header: true,
    complete: (results: { data: any }) => {
      const rows = results.data;
      const uniqueYears = new Set<string>();

      rows.forEach((row: { [x: string]: string }) => {
        if (row['Graduation Year']) {
          uniqueYears.add(row['Graduation Year'].trim());
        }
      });

      setGradYears(Array.from(uniqueYears));
    }
  });
};

function Issuer() {
  const [fileUploaded, setFile] = useState<File>();
  const [university, setUniversity] = useState<string>("");
  const [globalState, setGlobalState] = useState<any>(null);
  const methodArg = useRef('');
  const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [txID, setTxId] = useState<string>('');
  const [multipleYrs,setMultipleYrs] = useState<boolean>(false)
  const [gradYears, setGradYears] = useState<string[]>([]);
  const [startYear, setStartYear] = useState<number>(1940);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [gradyr,setGradYr] = useState<number>(1940);

  // Generate list of years from 1940 to the current year
  const years = Array.from(
    { length: endYear - 1940 + 1 },
    (_, index) => 1940 + index
  );

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
      console.log('\nBalance:', accountInfo.amount / 1000000, 'Algos');
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

  const callUpdateUCID = async () => {
    if (!account || !methodArg.current) return;

    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();

    const contract = new algosdk.ABIContract(abi);
    const updateMethod = algosdk.getMethodByName(contract.methods, 'update_UCID');

    atc.addMethodCall({
      appID: appIndex,
      method: updateMethod,
      methodArgs: [methodArg.current],
      sender: account.addr,
      suggestedParams,
      signer: async (unsignedTxns) => unsignedTxns.map((t) => t.signTxn(account.sk)),
    });

    try {
      const result = await atc.execute(algodClient, 3);
      const transactionID = result.txIDs[0];
      setTxId(transactionID);
      setShowModal(true);
      await readGlobalState();
    } catch (error) {
      console.error('Failed to update UCID:', error);
    }
  };

  const handleClick = async () => {
    if (!fileUploaded) return;

    const fileBlob = new Blob([fileUploaded]);
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
        const university_hash = await pinFiletoIPFS(blob, university);
        //setUCID(university_hash);
        methodArg.current = university_hash;
        callUpdateUCID();
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      parseCSV(file, setGradYears);
    }
  };

  const handleUniversityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniversity(event.target.value);
  };

  return (
    <section style={{ marginBottom: '-3vh' }} className="w-full flex items-center flex-col justify-center block pt-10">
      <div className="items-center flex flex-col py-8 px-4 mx-auto w-full text-center lg:py-16 lg:px-12">
        <h1 className="mt-4 mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl dark:text-white">Issue Your Credentials.</h1>
        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="universityId" className="text-left block text-md font-medium leading-6 text-white">
                Enter Your University's ALGOTrust ID
              </label>
              <div className="mt-2">
                <input
                  id="universityId"
                  name="universityId"
                  type="text"
                  required
                  autoComplete="off"
                  value={university}
                  onChange={handleUniversityChange}
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-transparent ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <FileUpload onFileChange={handleFileChange} />
            </div>

            
<label className="inline-flex items-center cursor-pointer">
  <input onChange={(e)=>{setMultipleYrs(!multipleYrs)}} type="checkbox" value="" className="sr-only peer"/>
  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span className="ms-3 text-md font-medium text-white dark:text-white">File {multipleYrs?"contains":"does not contain"} multi-year records</span>
</label>

{!multipleYrs && <div>
              <label htmlFor="universityId" className="text-left block text-md font-medium leading-6 text-white">
                Enter Graduation Year
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  required
                  autoComplete="off"
                  placeholder="Graduation Year"
                  value={gradyr}
                  onChange={(e)=>{setGradYr(Number(e.target.value))}}
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm bg-transparent ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>}
            
            {multipleYrs && <div className="sm:col-span-4 flex flex-col w-full">
  <label htmlFor="username" className="block text-md font-medium leading-6 text-white mb-4">
    Years of Credentials Included
  </label>

  <div className="flex flex-row gap-x-4 pl-12 items-center block">
  <div className="flex flex-col w-32">
    <label htmlFor="start-year" className="block text-md font-medium leading-6 text-white">
      Start Year:
    </label>
    <select
      id="start-year"
      name="start-year"
      value={startYear}
      onChange={(e) => setStartYear(Number(e.target.value))}
      className="mt-1 text-white block w-full border-gray-300 rounded-md shadow-sm text-black bg-transparent focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      {years.map((year) => (
        <option key={year} value={year} className="text-black">
          {year}
        </option>
      ))}
    </select>
  </div>

  <div className="flex flex-col w-32">
    <label htmlFor="end-year" className="block text-md font-medium leading-6 text-white">
      End Year:
    </label>
    <select
      id="end-year"
      name="end-year"
      value={endYear}
      onChange={(e) => setEndYear(Number(e.target.value))}
      className="mt-1 block text-white w-full border-gray-300 rounded-md shadow-sm text-black bg-transparent focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      {years.map((year) => (
        <option key={year} value={year} className="text-black">
          {year}
        </option>
      ))}
    </select>
  </div>
</div>


  
</div>
}




            <button
              type="submit"
              onClick={handleClick}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-5 py-3 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Issue Credentials
            </button>

          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create your University's ALGOTrust ID
            </a>
          </p>
        </div>
        
      </div>
      {showModal && <TransactionModal txnID={txID} />}
    </section>
  );
}

export default Issuer;
