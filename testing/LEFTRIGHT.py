
import hashlib
def hash_func(value):
    return hashlib.sha256(value.encode()).hexdigest()
L1 = {'key': '000', 'value': 'H000'}
L2 = {'key': '001', 'value': 'H001'}

L1_value_hash = hash_func(L1['value'])
L1_key_hash = hash_func(L1['key'])
L2_value_hash = hash_func(L2['value'])
L2_key_hash = hash_func(L2['key'])

L1_leaf_hash = hash_func(L1_value_hash + L1_key_hash)
L2_leaf_hash = hash_func(L2_value_hash + L2_key_hash)

print(f"L1 Leaf Hash (Value Hash + Key Hash): {L1_leaf_hash}")
print(f"L2 Leaf Hash (Value Hash + Key Hash): {L2_leaf_hash}")

computed_root = hash_func(L1_leaf_hash + L2_leaf_hash)  # Initialize with the concatenation

proof_hashes = [L1_leaf_hash, L2_leaf_hash]
for i in range(len(proof_hashes) - 1, 0, -1):

    computed_root = hash_func(proof_hashes[i - 1] + computed_root)

print(f"Computed Root (R1) Hash: {computed_root}")

root_hash = hash_func(L1_leaf_hash + L2_leaf_hash)
for i in range(len(proof_hashes) - 1, 0, -1):
    root_hash = hash_func(proof_hashes[i - 1] + root_hash)
print(f"Expected Root (R1) Hash: {root_hash}")

if computed_root == root_hash:
    print("The computed root matches the given root. Proof successful.")
else:
    print("Proof failed. Computed root does not match the given root.")
