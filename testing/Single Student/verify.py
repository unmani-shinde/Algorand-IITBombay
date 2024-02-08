import hashlib
import json

def calculate_merkle_root(final_hashes):
    intermediate_hashes = final_hashes.copy()

    while len(intermediate_hashes) > 1:
        if len(intermediate_hashes) % 2 != 0:
            intermediate_hashes.append(intermediate_hashes[-1])

        new_hashes = []
        for i in range(0, len(intermediate_hashes), 2):
            combined_hash_data = intermediate_hashes[i] + intermediate_hashes[i+1]
            combined_final_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()  # noqa: E501
            new_hashes.append(combined_final_hash)

        intermediate_hashes = new_hashes

    return intermediate_hashes[0]

with open('verifications.json','r') as file:
    data = json.load(file)
    
    target_root = ""

    finalHash = []

    for document in data:
        target_root = document["merkel_root"]
        finalHash = document["final_hashes"]

merkle_root = calculate_merkle_root(finalHash)
print(merkle_root)

print("Student Unique No:", 1000)

# Verify the Merkle root
is_valid = merkle_root == target_root

# Print the verification result
if is_valid:
    print("\nVerification: Passed")
else:
    print("\nVerification: Failed")