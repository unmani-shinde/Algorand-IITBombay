
# import hashlib
# import json

# def verify_merkle_root(data, merkle_openings, target_root):
#     computed_hash = hashlib.sha256(data.encode('utf-8')).hexdigest()
#     print("Computed Hash (Leaf Node):", computed_hash)

#     for proof in merkle_openings:
#         combined_data = proof + computed_hash
#         computed_hash = hashlib.sha256(combined_data.encode('utf-8')).hexdigest()
#         print("Combined Hash:", combined_data)
#         print("Computed Hash:", computed_hash)

#     return computed_hash == target_root

# # Load verification data from the JSON file
# with open('verifications.json', 'r') as file:
#     verifications = json.load(file)

# # Specify the verification parameters
# student_index = 2

# # Get the verification details for the specified student
# verification = verifications[student_index]
# nonce = verification['nonce']
# document_hash = verification['document_hash']
# merkle_openings = verification['merkle_opening']
# target_root = "84ff0406292c03ca73d99954190fa51adb42840f525e5b4a9ebe8b26da06f636"

# # Concatenate the nonce and document hash
# data = document_hash + nonce

# # Verify the Merkle root
# is_valid = verify_merkle_root(data, merkle_openings, target_root)

# # Print the verification result
# if is_valid:
#     print("Verification: Passed")
# else:
#     print("Verification: Failed")


# import hashlib
# import json

# def verify_merkle_root(data, merkle_openings, target_root):
#     computed_hash = hashlib.sha256(data.encode('utf-8')).hexdigest()
#     print("Computed Hash (Leaf Node):", computed_hash)

#     for proof in merkle_openings:
#         combined_data = proof + computed_hash
#         computed_hash = hashlib.sha256(combined_data.encode('utf-8')).hexdigest()
#         print("Combined Hash:", combined_data)
#         print("Computed Hash:", computed_hash)

#     return computed_hash == target_root

# # Load verification data from the JSON file
# with open('verifications.json', 'r') as file:
#     verifications = json.load(file)

# # Specify the verification parameters
# student_index = 2

# # Get the verification details for the specified student
# verification = verifications[student_index]
# nonce = verification['nonce']
# document_hash = verification['document_hash']
# merkle_openings = verification['merkle_opening']
# target_root = "06f046e50dc9610579c6060dce19fab98259a7677e0380902c3b40a1aa4a3762"

# # Concatenate the nonce and document hash
# data = document_hash + nonce

# # Verify the Merkle root
# is_valid = verify_merkle_root(data, merkle_openings, target_root)

# # Print the verification result
# if is_valid:
#     print("Verification: Passed")
# else:
#     print("Verification: Failed")


import hashlib
def build_merkle_tree(merkle_hashes):
    if len(merkle_hashes) == 1:
        return merkle_hashes[0]

    next_level = []
    for i in range(0, len(merkle_hashes), 2):
        hash_value = merkle_hashes[i]
        if i + 1 < len(merkle_hashes):
            hash_value += merkle_hashes[i + 1]
        combined_hash = hashlib.sha256(hash_value.encode('utf-8')).hexdigest()
        next_level.append(combined_hash)

    return build_merkle_tree(next_level)


# Specify the verification parameters
merkle_hashes = [
     "3239e88cb2169e1582c86a5bc76807807c955b60b4e0c91651cbfe5aa37f6e85",
    "e3d98c80684213df25ea3b9ca7b5afd47abc6aa80b3c38c5a98a0219eb43b0b1",
        "a036904f31ca67ced19c1077a6a3a947a2d3b5cca1d8fdbda767dd17e02e9401",
         "d457eece435f6ec969464d9c700685753dc82afe321dc93ca30e00b4cb76a96c"
]
target_root = "e64ca84cf2cdfdf3edf187a6e9137c82fe1a07409fb889ac2884111a6b0d3bf5"

# Build the Merkle tree and calculate the root
merkle_root = build_merkle_tree(merkle_hashes)

# Print the Merkle hashes
print("Merkle Hashes:")
for i, hash_value in enumerate(merkle_hashes, start=1):
    print(f"Hash {i}: {hash_value}")

# Print the calculated Merkle root
print("\nCalculated Merkle Root:")
print(merkle_root)

# Verify the Merkle root
is_valid = merkle_root == target_root

# Print the verification result
if is_valid:
    print("\nVerification: Passed")
else:
    print("\nVerification: Failed")

