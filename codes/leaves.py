import hashlib


class MerkleTree:
    def __init__(self, leaves):
        self.leaves = leaves
        self.tree = self.build_tree()

    def build_tree(self):
        num_leaves = len(self.leaves)
        if num_leaves == 0:
            return None
        if num_leaves == 1:
            return self.hash_leaf(self.leaves[0])

        nodes = [self.hash_leaf(leaf) for leaf in self.leaves]

        while len(nodes) > 1:
            if len(nodes) % 2 != 0:
                nodes.append(nodes[-1])
            nodes = [self.hash_nodes(nodes[i], nodes[i + 1]) for i in range(0, len(nodes), 2)]

        return nodes[0]

    def hash_leaf(self, leaf):
        return hashlib.sha256(leaf.encode()).hexdigest()

    def hash_nodes(self, node1, node2):
        return hashlib.sha256((node1 + node2).encode()).hexdigest()

    def locate_leaf(self, leaf_hash):
        return self.tree == leaf_hash


# Usage example
leaves = ["Transaction 1", "Transaction 2", "Transaction 3", "Transaction 4"]
merkle_tree = MerkleTree(leaves)
root_hash = merkle_tree.tree
print("Merkle Root Hash:", root_hash)

leaf_hash = hashlib.sha256("Transaction 1".encode()).hexdigest()
is_leaf_present = merkle_tree.locate_leaf(leaf_hash)
if is_leaf_present:
    print("Leaf hash is present in the Merkle tree.")
else:
    print("Leaf hash is not present in the Merkle tree.")
