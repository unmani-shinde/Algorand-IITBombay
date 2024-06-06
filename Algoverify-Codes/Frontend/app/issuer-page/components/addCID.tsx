import algosdk from 'algosdk';

async function addCidToAlgorand(cid: string) {
    try {
        // Configure your client
        const algodToken = 'Your-Algod-Token';
        const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
        const algodPort = '';
        const headers = {
            "X-API-Key": algodToken // For PureStake, use this header
        };

        const algodClient = new algosdk.Algodv2(headers, algodServer, algodPort);

        // Recover the account to pay for the transaction
        const passphrase = "Your 25-word mnemonic goes here...";
        const myAccount = algosdk.mnemonicToSecretKey(passphrase);

        // Get the parameters for the transaction
        const params = await algodClient.getTransactionParams().do();

        // Your smart contract's Application ID
        const appID = 677906809; // Replace with your actual App ID

        // Encoding the arguments for the transaction
        const arg: Record<string | number | symbol, any> = {};
        arg.cid = cid
        const args = [algosdk.encodeObj(arg.cid), algosdk.encodeObj(arg.cid)];

        // Create a transaction for the smart contract
        const txn = algosdk.makeApplicationNoOpTxn(myAccount.addr, params, appID, args);

        // Sign the transaction
        const signedTxn = txn.signTxn(myAccount.sk);
        const txId = txn.txID().toString();

        // Send the transaction
        await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation
        const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        console.log("Transaction confirmed in round " + confirmedTxn["confirmed-round"]);

        return confirmedTxn;
    } catch (err) {
        console.error('Failed to add CID to Algorand:', err);
        throw err;
    }
}

export default addCidToAlgorand
