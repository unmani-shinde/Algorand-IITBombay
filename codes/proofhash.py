import hashlib

def calculate_merkle_root(hashes):
    if len(hashes) == 0:
        return None

    while len(hashes) > 1:
        if len(hashes) % 2 != 0:
            hashes.append(hashes[-1])

        new_hashes = []
        for i in range(0, len(hashes), 2):
            combined_hash_data = hashes[i] + hashes[i+1]
            combined_final_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()
            new_hashes.append(combined_final_hash)

        hashes = new_hashes

    return hashes[0]

def generate_merkle_proof(merkle_tree, target_hash):
    proof = []
    index = merkle_tree.index(target_hash)
    tree_size = len(merkle_tree)
    proof_index = index

    while tree_size > 1:
        sibling_index = proof_index + 1 if proof_index % 2 == 0 else proof_index - 1

        if sibling_index < tree_size:
            proof.append(merkle_tree[sibling_index])

        proof_index = proof_index // 2
        tree_size = (tree_size + 1) // 2

    return proof

def verify_merkle_proof(root_hash, target_hash, proof):
    current_hash = target_hash

    for sibling_hash in proof:
        if current_hash == sibling_hash:
            combined_hash_data = current_hash + sibling_hash
            current_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()
        else:
            combined_hash_data = sibling_hash + current_hash
            current_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()

    return current_hash == root_hash

# Example usage

# List of final hashes representing the Merkle tree
merkle_tree = [
    "hashA",
    "hashB",
    "hashC",
    "hashD"
]

# Calculate the Merkle root
merkle_root = calculate_merkle_root(merkle_tree)

# Generate a Merkle proof for a specific hash
target_hash = "hashC"
proof = generate_merkle_proof(merkle_tree, target_hash)

# Verify the Merkle proof
is_valid = verify_merkle_proof(merkle_root, target_hash, proof)

# Print the result
print("Merkle Root:", merkle_root)
print("Target Hash:", target_hash)
print("Proof:", proof)
print("Is Valid:", is_valid)
