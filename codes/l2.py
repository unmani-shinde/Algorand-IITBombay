import hashlib

def calculate_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()

def build_merkle_tree(leaves):
    if len(leaves) != 4:
        raise ValueError("Number of leaves should be 4")

    tree = []

    # Create leaf nodes and calculate their hashes
    for leaf in leaves:
        leaf_hash = calculate_hash(leaf)
        tree.append(leaf_hash)

    # Create the parent nodes by hashing adjacent leaf nodes
    while len(tree) > 1:
        parent_nodes = []
        for i in range(0, len(tree), 2):
            left_child = tree[i]
            right_child = tree[i + 1] if i + 1 < len(tree) else tree[i]  # Duplicate last node if odd number of nodes
            parent_hash = calculate_hash(left_child + right_child)
            parent_nodes.append(parent_hash)
        tree = parent_nodes

    return tree[0]  # Return the root node

def verify_merkle_tree(root, leaves):
    if len(leaves) != 4:
        raise ValueError("Number of leaves should be 4")

    # Calculate the hash of each leaf and check if it matches the root
    calculated_root = build_merkle_tree(leaves)
    if root == calculated_root:
        return True
    else:
        return False

# Example usage
leaves = ['leaf1', 'leaf2', 'leaf3', 'leaf4']
root = build_merkle_tree(leaves)
print("Root:", root)

# Print the hashes of all leaves
print("Leaf Hashes:")
for leaf in leaves:
    leaf_hash = calculate_hash(leaf)
    print(leaf, ":", leaf_hash)

# Print the hashes of all nodes
print("\nNode Hashes:")
tree = leaves[:]
level = 1
while len(tree) > 1:
    parent_nodes = []
    for i in range(0, len(tree), 2):
        left_child = tree[i]
        right_child = tree[i + 1] if i + 1 < len(tree) else tree[i]
        parent_hash = calculate_hash(left_child + right_child)
        parent_nodes.append(parent_hash)
        print("Level", level, ":", left_child, "+", right_child, "->", parent_hash)
    tree = parent_nodes

# Verify the integrity of the leaves
leaves[1] = 'modified_leaf'
is_valid = verify_merkle_tree(root, leaves)
print("\nLeaves are valid:", is_valid)
