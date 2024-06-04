import pandas as pd
import hashlib

filepath = '/content/drive/MyDrive/XYZ_University.csv'
df = pd.read_csv(filepath)

df.columns.tolist()

df['First Name'] = df.apply(lambda row: (row['First Name'] + " " + (row['Last Name'] if isinstance(row['Middle Name'], float) else row['Middle Name'] + " " + row['Last Name']).strip()), axis=1)
df.drop(columns=['Middle Name', 'Last Name'], inplace=True)
df.rename(columns={'First Name': 'Full Name'}, inplace=True)

df.values

df.columns

import hashlib

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

# student = df.values[0]
# student_data_list = student.tolist()
# student_data_list = [str(info) if isinstance(info, (int, float)) else info for info in student_data_list]

# merkle_tree = MerkleTree(student_data_list)

semi_private_database = {}
index = 0

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

  semi_private_database[index] = mini_dict

  index +=1

spdb_df = pd.DataFrame(semi_private_database)
spdb_df = spdb_df.T
spdb_df.head()


def basic_hash(s):
  return hashlib.sha256(s.encode('utf-8')).hexdigest()

def hash_fxn(left, right):
    # Create a SHA-256 hash of the concatenation of two hashes
    combined_hash = hashlib.sha256((left + right).encode('utf-8'))
    return combined_hash.hexdigest()

student_name = str(input("Enter the full name of the student in the format FirstName MiddleName LastName: "))
student_SID = str(input("Enter your Student ID: "))
student_grad_year = str(input("Enter your Graduation Year: "))
# student_name= "Alice Anne Smith"
# student_SID="10001"
# student_grad_year="2023"
db = spdb_df

if student_SID not in spdb_df["SID"].values:
  print(f"Student ID {student_SID} not found in database.")
else:
  student_row = spdb_df.loc[spdb_df["SID"] == student_SID]
  student_row=student_row.to_numpy()
  personal_hash = student_row[0][1]
  if(hash_fxn(basic_hash(student_SID),basic_hash(student_name))==personal_hash):
    print("Student Record Identified!")
    tree = student_row[0]

    super_root= tree[-1]
    tree = tree[1:-1]
    if(len(tree)%2!=0):
      tree.append(tree[-1])

    while(len(tree)!=1):
      existing_tree = tree
      tree = []
      for i in range(0,len(existing_tree),2):
        hash = hash_fxn(existing_tree[i],existing_tree[i+1])
        tree.append(hash)
      if(len(tree)!=1 and len(tree)%2!=0):
        tree.append(tree[-1])

    if(tree[0]==super_root):
      print("Record Verified!",student_name,"graduated in",student_grad_year,"from XYZ University.")



  else:
    print(hash_fxn(student_SID,student_name))
    print(personal_hash)

    print("No such student record. Please check SID or Full Name in correct format")