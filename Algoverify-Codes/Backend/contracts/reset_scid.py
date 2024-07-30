from base64 import b64decode
import os
from dotenv import load_dotenv
from algosdk import account, mnemonic
from algosdk.v2client import algod, indexer
from algosdk.atomic_transaction_composer import AtomicTransactionComposer, AccountTransactionSigner
from algosdk.abi import Contract
import json


load_dotenv()

# Load environment variables
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
MNEMONIC = os.getenv("NEXT_PUBLIC_ALGO_MNEMONIC")
SENDER_ADDRESS = os.getenv("NEXT_PUBLIC_ALGO_ADDR")
APP_ID = os.getenv("NEXT_PUBLIC_ALGO_APP_ID")  # Replace with your actual app ID
#print("\n\n\n PRINTING MNEMONIC " + str(MNEMONIC) + "\n\n\n\n\n")

# Initialize Algod client
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
indexer_client = indexer.IndexerClient('', 'https://testnet-idx.algonode.cloud', '')

# Load the ABI
with open('../contracts/artifacts/contract.json', 'r') as f:
    contract_json = json.load(f)
contract = Contract.from_json(json.dumps(contract_json))

# New UCID value
NEW_UCID = "QmeXMGgv39vMamgEhkM9PtfthLSnvYfqQr7HYXhLHap9wK"

def update_ucid():
    # Recover account from mnemonic
    private_key = mnemonic.to_private_key(MNEMONIC)

    # Get suggested parameters
    params = algod_client.suggested_params()

    # Create AtomicTransactionComposer
    atc = AtomicTransactionComposer()

    # Get the 'update_SCID' method
    update_method = contract.get_method_by_name("update_UCID")

    # Add method call to ATC
    atc.add_method_call(
        app_id=APP_ID,
        method=update_method,
        sender=SENDER_ADDRESS,
        sp=params,
        signer=AccountTransactionSigner(private_key),
        method_args=[NEW_UCID]
    )

    # Execute transaction
    result = atc.execute(algod_client, 3)

    # Print result
    #print(f"Transaction ID: {result.tx_ids[0]}")
    print("UCID updated successfully!")

TxID = "LW37EI5DPKF72JRGDNZB3B3B76IGAAVZZ52RRDUFSIC2ASFHHWTA"
def fetch_state_from_txid(txid):
    try:
        tx_info = indexer_client.transaction(txid)
        #print(tx_info)
        global_state_delta = tx_info['transaction']['global-state-delta'][0]
        return str(b64decode(global_state_delta['key']).decode()) + ": " + str(b64decode(global_state_delta['value']['bytes']).decode())
    except Exception as e:
        print(f"Error fetching with Indexer: {e}")

    return "Nope"

if __name__ == "__main__":
    update_ucid()
    #print(fetch_state_from_txid(TxID))