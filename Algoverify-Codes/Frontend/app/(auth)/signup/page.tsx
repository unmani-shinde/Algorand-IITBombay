"use client"; // Ensure this component runs on the client side

import { useState, useEffect,useRef } from 'react';
import { Magic } from 'magic-sdk';
import { AlgorandExtension } from '@magic-ext/algorand';
import * as abi from '@/app/contracts/artifacts/contract.json';
import algosdk from 'algosdk';
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
const appIndex = Number(process.env.NEXT_PUBLIC_ALGO_APP_ID);

import ExportCSV from '@/app/verifier-page/components/verifyCSV';
import pinFiletoIPFS from '@/app/issuer-page/components/pinFiletoIFPS';
import deleteFromIPFS from '@/app/components/deleteFromIPFS';
import TrustIDModal from './components/Modal';

export default function SignIn() {
  const [emailID, setEmailID] = useState<string>('');
  const [organization,setOrganization] = useState<string>('');
  const [city,setCity] = useState<string>('');
  const [country,setCountry] = useState<string>('');
  const [provider, setProvider] = useState<Magic<{ algorand: AlgorandExtension }> | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [SCID,setSCID] = useState<String>("")
  const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);
  const [trustID,setTrustID] = useState<string>("");
  const [txID, setTxId] = useState<String>('');
  const [openModal, setOpenModal] = useState(true);
  const methodArg = useRef('')

  useEffect(() => {
    const initialize = async () => {
      console.log("Hieee");
      const mnemonic = process.env.NEXT_PUBLIC_ALGO_MNEMONIC?.toString() as string || "";
      const addr = process.env.NEXT_PUBLIC_ALGO_ADDR?.toString() as string || ""; 
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


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const magic = new Magic('pk_live_B5BD957434321A6E', {
        extensions: {
          algorand: new AlgorandExtension({
            rpcUrl: 'https://testnet-api.algonode.cloud', // Should remain empty as per the configuration
          }),
        },
      });
      setProvider(magic);
    }
  }, []);

  const generateTrustID = () => {
    const getInitials = (text: string) => 
      text.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  
    const orgInitials = getInitials(organization);
    const cityInitials = getInitials(city);
    const countryInitials = getInitials(country);
  
    const initials = `${orgInitials}_${cityInitials}_${countryInitials}`;

    return initials
    
  };
  

  const LogTrustID = (event:any) =>{
    event.preventDefault();
    let ALGOTrustID = generateTrustID();
    console.log(ALGOTrustID);
  }

  function convertJsonToCsv(jsonData:any) {
    const header = Object.keys(jsonData[0]).join(',') + '\n';
    const rows = jsonData.map((obj:any) => Object.values(obj).join(',')).join('\n');
    return header + rows;
}

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

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    
    event.preventDefault();
    if (provider) {
      try {
        let oldSCID = SCID;        
        const blob = await ExportCSV(oldSCID);
        let UCID_Map = new Blob([blob as BlobPart]);
        const formData = new FormData();
        formData.append('ucid_map',UCID_Map, 'data.csv');
        let ALGOTrustID = generateTrustID();
        setOpenModal(true);

        const res = await fetch(`http://127.0.0.1:5000/register-university?algotrustid=${ALGOTrustID}&university=${organization}&orgemail=${emailID}`, {
          method: 'POST',
          body: formData,
        });
        

        if(res.ok){
          try {
            const data = await res.json();
            const csvString = convertJsonToCsv(data);
            const blob = new Blob([csvString], { type: 'text/csv' });
            const newSCID = await pinFiletoIPFS(blob,"UCID_Map.csv")
            methodArg.current = newSCID;
            await callUpdateSCID();
            await deleteFromIPFS(oldSCID as string); 

            const did = await provider.auth.loginWithEmailOTP({ email: emailID, showUI: true });
            console.log(`DID Token: ${did}`);
            const userInfo = await provider.user.getInfo();
            console.log(`UserInfo:`, userInfo);
            setUserInfo(userInfo);

            setTrustID(generateTrustID());
            
          } catch (error) {
              console.error("MAGIC Setup failed:", error);     
          }

        }
        else if(res.status==400){
          console.log("University record exists");
        }
        else{
          console.log("File upload failed.");
        }



        
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      console.error("Magic instance is not initialized");
    }
  };

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-4xl mx-auto text-center pb-12 md:pb-10">
            <h1 style={{marginBottom:'-5vh',marginTop:'-10vh'}} className="h1">Issue a Verifiable Credential.</h1>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">

                <div>
                    <label htmlFor="email" className="block text-left text-md font-medium leading-6 text-white">
                      Name of the Organization
                    </label>
                    <div className="mt-2">
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="text-md tracking-wide bg-transparent block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-left text-md font-medium leading-6 text-white">
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="text-md tracking-wide bg-transparent block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-left text-md font-medium leading-6 text-white">
                      Country
                    </label>
                    <div className="mt-2">
                      <input
                        id="country"
                        name="country"
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="text-md tracking-wide bg-transparent block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>



                  <div>
                    <label htmlFor="email" className="block text-left text-md font-medium leading-6 text-white">
                      Organization Email Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={emailID}
                        onChange={(e) => setEmailID(e.target.value)}
                        className="text-md tracking-wide bg-transparent block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>



                  <div className='flex flex-col'>

                    <button
                      onClick={handleLogin}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Create ALGOTrust Wallet and ID
                    </button>
                    <TrustIDModal showModal={openModal} trustID={trustID} />
                  </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Already Registered?{' '}
                  <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Click here to Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
