import hashlib
import secrets

def append_nonce_to_hash(data):
    # Generate a random nonce
    nonce = secrets.token_hex(16)
    data = data+nonce
    # Create a hash object
    hash_object = hashlib.sha256()

    # Update the hash with the data
    hash_object.update(data.encode('utf-8'))

    # Append the nonce to the hash
    # hash_object.update(nonce.encode('utf-8'))

    # final hash 
    final_hash = hash_object.hexdigest()

    return nonce, final_hash

data = "Hello world"
nonce, final_hash = append_nonce_to_hash(data)

print("Data:", data)
print("Nonce:", nonce)
# print("Hash of Input:", hashlib.sha256(data.encode('utf-8')).hexdigest())
print("Hash with Nonce:", final_hash)
