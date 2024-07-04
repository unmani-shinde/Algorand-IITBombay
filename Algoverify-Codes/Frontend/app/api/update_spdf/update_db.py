import pandas as pd
import hashlib
from datetime import datetime

class MerkleTree:

    def __init__(self, parameters_list):
        self.headers = []
        self.details = []
        self.leaves = [(data, self.hash_leaf(data)) for data in parameters_list]
        self.tree = self.build_tree(self.leaves)

    def hash_leaf(self, data):
        # Create a SHA-256 hash of the data
        hash_object = hashlib.sha256(data.encode('utf-8'))
        return hash_object.hexdigest()

    def hash_node(self, left, right):
        # Create a SHA-256 hash of the concatenation of two hashes
        hash_object = hashlib.sha256((left + right).encode('utf-8'))
        return hash_object.hexdigest()

    def build_tree(self, leaves):
        # Build the Merkle tree from the bottom up
        tree = []
        current_level = leaves

        while len(current_level) > 1:
            tree.append(current_level)
            next_level = []

            # If the number of nodes is odd, duplicate the last node
            if len(current_level) % 2 == 1:
                current_level.append(current_level[-1])

            for i in range(0, len(current_level), 2):
                left_data, left_hash = current_level[i]
                right_data, right_hash = current_level[i + 1]
                next_level.append((f"{left_data} + {right_data}", self.hash_node(left_hash, right_hash)))

            # Store headers and details at the second level
            if len(tree) == 1:  # The second level (index 1 in the tree)
                for i in range(len(next_level)):
                    header = "Hash0" + str(i)
                    self.details.append(next_level[i][1])
                    self.headers.append(header)
                    self.headers[0] = "PersonalHash"

            current_level = next_level

        tree.append(current_level)
        return tree

    def get_root(self):
        return self.tree[-1][0][1] if self.tree else None

    def print_tree(self):
        for level in self.tree:
            print(level)

    def get_headers(self):
        return self.headers

    def get_details(self):
        return self.details

def process_csv(file):
    df = pd.read_csv(file)
    
    df['Full Name'] = df.apply(lambda row: (row['First Name'] + " " + (row['Last Name'] if isinstance(row['Middle Name'], float) else row['Middle Name'] + " " + row['Last Name']).strip()), axis=1)
    df.drop(columns=['Middle Name', 'Last Name'], inplace=True)
    df.rename(columns={'First Name': 'Full Name'}, inplace=True)
    
    return df

def create_semi_private_database(df, start_index=0):
    semi_private_database = {}
    index = start_index

    for student in df.values:
        student_data_list = student.tolist()
        student_data_list = [str(info) if isinstance(info, (int, float)) else info for info in student_data_list]
        merkle_tree = MerkleTree(student_data_list)
        headers = merkle_tree.get_headers()
        details = merkle_tree.get_details()
        mini_dict = {}
        mini_dict["SID"] = student_data_list[0]
        
        for i in range(len(headers)):
            mini_dict[headers[i]] = details[i]
        
        mini_dict["SuperRootIdentifier"] = merkle_tree.get_root()
        mini_dict["Timestamp Added"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        semi_private_database[index] = mini_dict
        index += 1

    spdb_df = pd.DataFrame(semi_private_database).T
    return spdb_df



  