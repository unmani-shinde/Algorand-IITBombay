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

    tree = []

    # Create leaf nodes and calculate their hashes
    for leaf in leaves:
        leaf_hash = calculate_hash(leaf)
        tree.append(leaf_hash)

    # Verify each leaf belongs to the root node
    for leaf_hash in tree:
        if leaf_hash != root:
            return False

    return True

# Example usage
leaves = ['leaf1', 'leaf2', 'leaf3', 'leaf4']
root = build_merkle_tree(leaves)
print("Root:", root)

# Verify the integrity of the leaves
leaves[1] = 'modified_leaf'
is_valid = verify_merkle_tree(root, leaves)
print("Leaves are valid:", is_valid)
