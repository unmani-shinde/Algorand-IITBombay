import pandas as pd
import hashlib

def basic_hash(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

def hash_fxn(left, right):
    # Create a SHA-256 hash of the concatenation of two hashes
    combined_hash = hashlib.sha256((left + right).encode('utf-8'))
    return combined_hash.hexdigest()

def main(student_name,student_SID,student_grad_year):

    is_record_verified = True

    # student_name = str(input("Enter the full name of the student in the format FirstName MiddleName LastName: "))
    # student_SID = str(input("Enter your Student ID: "))
    # student_grad_year = str(input("Enter your Graduation Year: "))
    
    if student_SID not in spdb_df["SID"].values:
        is_record_verified = False
        return is_record_verified

    else:
        student_row = spdb_df.loc[spdb_df["SID"] == student_SID]
        student_row=student_row.to_numpy()
        personal_hash = student_row[0][1]

        if(hash_fxn(basic_hash(student_SID),basic_hash(student_name))==personal_hash):
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
                record_verification = True
                return record_verification
            else
                record_verification = False
                return record_verification
        else:
            record_verification = False
            return record_verification

if __name__ == "__main__":
    main()





