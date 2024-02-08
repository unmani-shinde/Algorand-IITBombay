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
            # print("Combined hash" , combined_hash_data)
            combined_final_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()  # noqa: E501
            # print("Combined final hash" , combined_final_hash)
            new_hashes.append(combined_final_hash)

        intermediate_hashes = new_hashes

    return intermediate_hashes[0]

with open('verifications.json','r') as file:
    data = json.load(file)
    
    finalHash = []

    for document in data:
        finalHash.append(document["final_hash"])

merkle_root = calculate_merkle_root(finalHash)

target_root = "485a5864ad1dd39247ac1e0967728ca774c6b4521f2282939b9c3672ad5a944c"

given_hash = "e9e9deae0f7d000eab6f340f1680a72c668f44b07da0f2cd2c25851d04d7bdca"

ind = finalHash.index(given_hash)
print("Student Unique No:", ind+1000)
# Verify the Merkle root
is_valid = merkle_root == target_root

# Print the verification result
if is_valid:
    print("\nVerification: Passed")
else:
    print("\nVerification: Failed")