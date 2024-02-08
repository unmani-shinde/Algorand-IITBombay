import hashlib
import secrets
import xml.etree.ElementTree as ET
import json

def calculate_merkle_root(final_hashes):
    intermediate_hashes = final_hashes.copy()

    while len(intermediate_hashes) > 1:
        if len(intermediate_hashes) % 2 != 0:
            intermediate_hashes.append(intermediate_hashes[-1])

        new_hashes = []
        for i in range(0, len(intermediate_hashes), 2):
            combined_hash_data = intermediate_hashes[i] + intermediate_hashes[i+1]
            # print("Combined hash" , combined_hash_data)
            combined_final_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()  # noqa: E501
            # print("Combined final hash" , combined_final_hash)
            new_hashes.append(combined_final_hash)

        intermediate_hashes = new_hashes

    return intermediate_hashes[0]

def append_nonce_to_hash(data):
    nonce = secrets.token_hex(16)
    hash_object = hashlib.sha256()
    hash_object.update(data.encode('utf-8'))
    # print("BEFORE ",hash_object)
    init_hash = hash_object.hexdigest()
    # print("FINAL HASH ", final_hash)
    comb_data = init_hash + nonce
    hash_object.update(comb_data.encode('utf-8'))
    final_hash = hash_object.hexdigest()
    # print("FINAL HASH WITH NONCE", final_hash)
    # print("AFTER ",data)
    return nonce, final_hash, init_hash

def read_data_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    student_element = root.find("student")
    name = student_element.find("name").text.strip()
    rollno = student_element.find("rollno").text.strip()
    university = student_element.find("university").text.strip()
    program = student_element.find("program").text.strip()
    year = student_element.find("year").text.strip()
    gpa = student_element.find("gpa").text.strip()
    data = f"{name}-{rollno}-{university}-{program}-{year}-{gpa}"
    return name, rollno, university, program, year, gpa, data

# Specify the paths to your XML files for each student
xml_file_paths = [
    "./DegreeS1.xml",
    "./DegreeS2.xml",
    "./DegreeS3.xml",
    "./DegreeS4.xml",
    "./DegreeS5.xml"
]

final_hashes = []
student_details = []
verifications = []
init_hashes = []

# Process each XML file
for xml_file_path in xml_file_paths:
    name, rollno, university, program, year, gpa, data = read_data_from_xml(xml_file_path)
    nonce, final_hash, init_hash = append_nonce_to_hash(data)
    print("Check ",data)
    init_hashes.append(init_hash)
    final_hashes.append(final_hash)

    student_details.append((name, rollno, university, program, year, gpa, nonce))

# Calculate the Merkle root
merkle_root = calculate_merkle_root(final_hashes)

print("Merkle Root:")
print(merkle_root)

# Create Merkle openings for each student
for i, final_hash in enumerate(final_hashes):
    merkle_opening = final_hashes[:i] + final_hashes[i+1:]
    verification = {
        'nonce': student_details[i][6],
        # 'nonce' : nonce,
        'document_hash': init_hashes[i],
        'final_hash': final_hash,
        'merkle_opening': merkle_opening
    }
    verifications.append(verification)

print("\nStudent Details:")
for i, detail in enumerate(student_details, start=1):
    name, rollno, university, program, year, gpa, nonce = detail
    print(f"\nStudent {i}:")
    print("Name:", name)
    print("Roll No:", rollno)
    print("University:", university)
    print("Program:", program)
    print("Year:", year)
    print("GPA:", gpa)
    print("Nonce:", nonce)
    print("Hash with Nonce:", final_hashes[i-1])
    print("Merkle Opening:", verifications[i-1]['merkle_opening'])

# Write verifications to a JSON file
with open('verifications.json', 'w') as file:
    json.dump(verifications, file, indent=4)
