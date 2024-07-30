"use client"
import { useState, useEffect, useRef } from 'react';
import { Magic } from 'magic-sdk';
import { AlgorandExtension } from '@magic-ext/algorand';
import * as abi from '../../../../Backend/artifacts/contract.json';
import algosdk from 'algosdk';
import TrustIDModal from './components/Modal';

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
const appIndex = Number(process.env.NEXT_PUBLIC_ALGO_APP_ID);

export default function SignIn() {
  const [emailID, setEmailID] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [trustID, setTrustID] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ready,setReady] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<Magic<{ algorand: AlgorandExtension }> | null>(null);
  const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);
  const [txID, setTxId] = useState<string>('');
  const [walletState,setWalletState] = useState<string>('');
  const methodArg = useRef('');

  useEffect(() => {
    const initialize = async () => {
      const mnemonic = process.env.NEXT_PUBLIC_ALGO_MNEMONIC?.toString() as string || "";
      const addr = process.env.NEXT_PUBLIC_ALGO_ADDR?.toString() as string || ""; 
      const recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);
      setAccount({ addr, sk: recoveredAccount.sk });
      setWalletAddress(addr);
      const accountInfo = await algodClient.accountInformation(addr).do();
      console.log('\nBalance:', accountInfo.amount / 1000000, 'Algos');
      await readGlobalState();
    };
    initialize();
  }, []);

  const readGlobalState = async () => {
    const appInfo = await algodClient.getApplicationByID(appIndex).do();
    const globalState = appInfo.params['global-state'];
    const walletAddrState = globalState.find(
      (item: { key: string, value: { bytes: string, type: number, uint: number } }) => {
        const key = Buffer.from(item.key, 'base64').toString('utf8');
        return key === 'WalletAddr';
      }
    );
    let value: string | null = null;
    if (walletAddrState && walletAddrState.value.type === 1) {
      value = Buffer.from(walletAddrState.value.bytes, 'base64').toString('utf8');
    }
    setWalletState(value || '');
    console.log('State Wallet Address Value:', value);
  };

  const callUpdateWalletAddress = async () => {
    if (!account || !methodArg.current) return;

    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();

    const contract = new algosdk.ABIContract(abi);
    const updateMethod = algosdk.getMethodByName(contract.methods, 'update_wallet_addr');

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
      await readGlobalState();
    } catch (error) {
      console.error('Failed to update UCID:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const magic = new Magic('pk_live_B5BD957434321A6E', {
        extensions: {
          algorand: new AlgorandExtension({
            rpcUrl: 'https://testnet-api.algonode.cloud',
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
  
    // Generate a random nonce between 0 and 1024
    const generateRandomNonce = () => {
      const nonce = Math.floor(Math.random() * 1024); // Random integer between 0 and 1024
      return nonce.toString().padStart(4, '0'); // Convert to string and pad to 4 digits
    };
  
    const nonce = generateRandomNonce();
  
    return `${orgInitials}${cityInitials}${countryInitials}${nonce}`;
  };
  
  
  
  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (provider) {
      try {

        let ALGOTrustID = generateTrustID();
        setTrustID(ALGOTrustID);
        setOpenModal(true);

        try {
          const did = await provider.auth.loginWithEmailOTP({ email: emailID, showUI: true });
          console.log(`DID Token: ${did}`);
          const userInfo = await provider.user.getInfo();

          console.log(`UserInfo:`, userInfo);
          const publicAddress = await provider.algorand.getWallet();
          console.log('algorand public address', publicAddress);
          setWalletAddress(publicAddress)
          methodArg.current = publicAddress;
          await callUpdateWalletAddress();
          // setWalletAddress(userInfo.issuer?.slice(9) as string)
          setReady(true);
        } catch (error) {
          console.error("MAGIC Setup failed:", error);
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
            <h1 style={{ marginBottom: '-5vh', marginTop: '-10vh' }} className="h1">Register to Issue a Verifiable Credential.</h1>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="organization" className="block text-left text-md font-medium leading-6 text-white">
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
                    <label htmlFor="city" className="block text-left text-md font-medium leading-6 text-white">
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
                    <label htmlFor="country" className="block text-left text-md font-medium leading-6 text-white">
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
                  </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Already Registered?{' '}
                  <a href="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Click here to Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ready && <TrustIDModal 
        showModal={openModal}
        walletTxn={txID} 
        walletAddress={walletAddress} 
        trustID={trustID} 
        onClose={() => setOpenModal(false)} 
      />}
      
    </section>
  );
}
