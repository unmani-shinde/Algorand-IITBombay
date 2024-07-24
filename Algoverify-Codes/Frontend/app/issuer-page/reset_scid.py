import os
from dotenv import load_dotenv
from algosdk import account, mnemonic
from algosdk.v2client import algod
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

# Load the ABI
with open('../contracts/artifacts/contract.json', 'r') as f:
    contract_json = json.load(f)
contract = Contract.from_json(json.dumps(contract_json))

# New SCID value
NEW_SCID = "QmbSNjK5gDF2mAaqzXNsVAGL37PWVPuK6MQWAkF7xv1Gm6"
NEW_TCID = "Qmd7t8Y58uxDim33tgnfE9vp19pUXJnJ2j9v8Z6goXbwS6"

def update_scid():
    # Recover account from mnemonic
    private_key = mnemonic.to_private_key(MNEMONIC)

    # Get suggested parameters
    params = algod_client.suggested_params()

    # Create AtomicTransactionComposer
    atc = AtomicTransactionComposer()

    # Get the 'update_SCID' method
    update_method = contract.get_method_by_name("update_SCID")

    # Add method call to ATC
    atc.add_method_call(
        app_id=APP_ID,
        method=update_method,
        sender=SENDER_ADDRESS,
        sp=params,
        signer=AccountTransactionSigner(private_key),
        method_args=[NEW_SCID]
    )

    # Execute transaction
    result = atc.execute(algod_client, 3)

    # Print result
    #print(f"Transaction ID: {result.tx_ids[0]}")
    print("SCID updated successfully!")

def update_tcid():
    # Recover account from mnemonic
    private_key = mnemonic.to_private_key(MNEMONIC)

    # Get suggested parameters
    params = algod_client.suggested_params()

    # Create AtomicTransactionComposer
    atc = AtomicTransactionComposer()

    # Get the 'update_SCID' method
    update_method = contract.get_method_by_name("update_TCID")

    # Add method call to ATC
    atc.add_method_call(
        app_id=APP_ID,
        method=update_method,
        sender=SENDER_ADDRESS,
        sp=params,
        signer=AccountTransactionSigner(private_key),
        method_args=[NEW_TCID]
    )

    # Execute transaction
    result = atc.execute(algod_client, 3)

    # Print result
    #print(f"Transaction ID: {result.tx_ids[0]}")
    print("TCID updated successfully!")

if __name__ == "__main__":
    update_scid()
    update_tcid()