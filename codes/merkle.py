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
            return self.leaves[0]

        # Create a list of leaf nodes as hashes
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


# Usage example
leaves = ["Transaction 1", "Transaction 2", "Transaction 3", "Transaction 4"]
merkle_tree = MerkleTree(leaves)
root_hash = merkle_tree.tree
print("Merkle Root Hash:", root_hash)
