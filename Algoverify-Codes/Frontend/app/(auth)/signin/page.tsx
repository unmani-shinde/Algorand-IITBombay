
"use client"
import Link from 'next/link'
import { Magic } from 'magic-sdk';
import { AlgorandExtension } from '@magic-ext/algorand';
import { useState,useEffect } from 'react';

export default function SignIn() {
  const [provider, setProvider] = useState<Magic<{ algorand: AlgorandExtension }> | null>(null);
  const [emailID,setEmailID] = useState<string>("");
  const [walletAddress,setWalletAddress] = useState<string>("")
  const [ALGOTrustID,setALGOTrustID] = useState<string>("")

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (provider) {
      try {
        try {
          const did = await provider.auth.loginWithEmailOTP({ email: emailID, showUI: true });
          console.log(`DID Token: ${did}`);
          const userInfo = await provider.user.getInfo();

          console.log(`UserInfo:`, userInfo);
          const publicAddress = await provider.algorand.getWallet();
          console.log('algorand public address', publicAddress);
          if(publicAddress!==walletAddress){
            alert("Login insuccessful! Incorrect Email ID or Wallet Address")
          }
          else {
            alert("Login successful! Redirecting to issue credentials page ...");
            window.location.href = "/issuer-page";
          }
        
          
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
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-24 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-4xl mx-auto text-center pb-12 md:pb-10">
            <h1 className="h1">Login to Issue Verifiable Credentials on Blockchain.</h1>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form>
              <div className="flex flex-wrap -mx-3">
                {/* <div className="w-full px-3">
                  <button className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
                    <svg className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                    </svg>
                    <span className="h-6 flex items-center border-r border-white border-opacity-25 mr-4" aria-hidden="true"></span>
                    <span className="flex-auto pl-16 pr-8 -ml-16">Sign in with Google</span>
                  </button>
                </div> */}
              </div>
            </form>
            {/* <div className="flex items-center my-6">
              <div className="border-t border-gray-700 border-dotted grow mr-3" aria-hidden="true"></div>
              <div className="text-gray-400">Or, sign in with your email</div>
              <div className="border-t border-gray-700 border-dotted grow ml-3" aria-hidden="true"></div>
            </div> */}
            <form>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="wallet-address">Enter Wallet Address <span className="text-red-600">*</span></label>
                  <input onChange={(e)=>setWalletAddress(e.target.value)} id="text" type="text" className="form-input w-full text-gray-300" placeholder="ABC12345" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="wallet-login-id">Enter Organization Email Address <span className="text-red-600">*</span></label>
                  <input onChange={(e)=>setEmailID(e.target.value)} id="text" type="text" className="form-input w-full text-gray-300" placeholder="janesmith@org.ac.in" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="algotrustid">University ALGOTrust ID <span className="text-red-600">*</span></label>
                  <input onChange={(e)=>{setALGOTrustID(e.target.value)}} id="algotrustid" type="text" className="form-input w-full text-gray-300" placeholder="XYZABC1234" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button onClick={handleSignIn} className="btn text-white bg-purple-600 hover:bg-purple-700 w-full">Sign in</button>
                </div>
              </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
                  Don't have an ALGOTrust ID?{' '}
                  <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Click here to Register your University
                  </a>
                </p>
            {/* <div className="text-gray-400 text-center mt-6">
              Don’t you have an account? <Link href="/signup" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Sign up</Link>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  )
}
