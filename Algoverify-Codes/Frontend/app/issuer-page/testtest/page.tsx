'use client'
import React, { useEffect, useState } from 'react';
import algosdk from 'algosdk';
import * as abi from '../artifacts/contract.json';

const AlgorandComponent: React.FC = () => {
  const [account, setAccount] = useState<{ addr: string; sk: Uint8Array } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [globalState, setGlobalState] = useState<any>(null);
  const [methodArg, setMethodArg] = useState<string>('');
  const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', undefined);
  const appIndex = 678299449; // Replace with your actual App ID

  useEffect(() => {
    const initialize = async () => {
      // Define the mnemonic and address
      const mnemonic = 'write flat glare bid later fame egg rich hope camera impose sort discover girl modify stay curious artefact flag state task anchor mean abandon mouse';
      const addr = 'KNIH4DLNOLV2UXEWVPC3IXDOF6MJMFOFHVQ5ZEMSOASIRAKUIIRDLCY7EI';

      // Recover the account from the mnemonic
      const recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);

      // Set the account
      setAccount({
        addr: addr,
        sk: recoveredAccount.sk
      });

      // Log the mnemonic and address (for verification purposes)
      console.log('\nMnemonic:', mnemonic);
      console.log('\nAddress:', addr);

      // Wait for account to be funded
      await waitForFunding(addr);

      // Get account balance
      const accountInfo = await algodClient.accountInformation(addr).do();
      setBalance(accountInfo.amount / 1000000);
    };

    initialize();
  }, []);

  const waitForFunding = async (address: string) => {
    console.log('Dispense ALGO at https://testnet.algoexplorer.io/dispenser...\n');
    let accountInfo = await algodClient.accountInformation(address).do();
    while (accountInfo.amount === 0) {
      accountInfo = await algodClient.accountInformation(address).do();
    }
    console.log(`${address} funded!`);
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
    console.log('\nSCID updated!\n');
  };

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMethodArg(event.target.value);
  };

  const handleUpdate = async () => {
    await callUpdateSCID();
  };

  const handleRead = async () => {
    await readGlobalState();
  };

  return (
    <div className='pl-32 py-64'>
      {account && <p>Account Address: {account.addr}</p>}
      {balance !== null && <p>Balance: {balance} Algos</p>}
      <div className='py-2'>
        <label>
          Enter Method Argument:
          <input className='text-zinc-700' type="text" value={methodArg} onChange={handleInputChange} />
        </label>
      </div>
      <div>
        <button className='bg-white my-16 mx-8 py-1 px-2 text-black' onClick={handleUpdate}>Update SCID</button>
        <button className="bg-white text-black py-1 px-2" onClick={handleRead}>Read SCID</button>
      </div>

      {globalState && (
        <div>
          <h2>The Global State value stored on the blockchain is:</h2>
          <pre>{JSON.stringify(globalState, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AlgorandComponent;