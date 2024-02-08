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
            combined_final_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()
            new_hashes.append(combined_final_hash)

        intermediate_hashes = new_hashes

    return intermediate_hashes[0]

def append_nonce_to_hash(nonce, hash_object, data):
    final_hashes = []
    for d in data:
        hash_object.update(d.encode('utf-8'))
        init_hash = hash_object.hexdigest()
        comb_data = init_hash + nonce
        hash_object.update(comb_data.encode('utf-8'))
        final_hash = hash_object.hexdigest()
        final_hashes.append(final_hash)
    return final_hashes

def read_data_from_xml(file_path):
    data = []
    tree = ET.parse(file_path)
    root = tree.getroot()
    student_element = root.find("student")
    name = student_element.find("name").text.strip()
    rollno = student_element.find("rollno").text.strip()
    university = student_element.find("university").text.strip()
    program = student_element.find("program").text.strip()
    year = student_element.find("year").text.strip()
    gpa = student_element.find("gpa").text.strip()
    data = [name, rollno, university, program, year, gpa]
    return name, rollno, university, program, year, gpa, data

# Specify the paths to your XML files for each student
xml_file_paths = [
    "./DegreeS1.xml",
    "./DegreeS2.xml",
    "./DegreeS3.xml",
    "./DegreeS4.xml",
    "./DegreeS5.xml"
]

main_json = {'students': []}

for xml_file_path in xml_file_paths:
    student_details = []

    name, rollno, university, program, year, gpa, data = read_data_from_xml(xml_file_path)

    # Initialize nonces for each field
    nonces = {
        'name': secrets.token_hex(16),
        'rollno': secrets.token_hex(16),
        'university': secrets.token_hex(16),
        'program': secrets.token_hex(16),
        'year': secrets.token_hex(16),
        'gpa': secrets.token_hex(16)
    }

    # Append nonces to respective fields
    hash_object = hashlib.sha256()
    final_hashes = append_nonce_to_hash(nonces['name'], hash_object, [name])
    final_hashes += append_nonce_to_hash(nonces['rollno'], hash_object, [rollno])
    final_hashes += append_nonce_to_hash(nonces['university'], hash_object, [university])
    final_hashes += append_nonce_to_hash(nonces['program'], hash_object, [program])
    final_hashes += append_nonce_to_hash(nonces['year'], hash_object, [year])
    final_hashes += append_nonce_to_hash(nonces['gpa'], hash_object, [gpa])

    print(f"Check {data} for {name}")

    # Calculate the Merkle root
    merkle_root = calculate_merkle_root(final_hashes)

    student_detail = {
        'name': name,
        'rollno': rollno,
        'university': university,
        'program': program,
        'year': year,
        'gpa': gpa,
        'nonces': nonces,
        'hashes': final_hashes,
        'merkle_root': merkle_root
    }

    student_details.append(student_detail)

    # Write verifications and nonces to a JSON file for each student
    output_data = {
        'student_details': student_details
    }
    file_name = f"{name.replace(' ', '_').lower()}_details.json"

    with open(file_name, 'w') as file:
        json.dump(output_data, file, indent=4)

    # Append student information to the main JSON
    main_json['students'].append({
        'name': name,
        'merkle_root': merkle_root,
        'file_name': file_name
    })

# Write the main JSON file
with open('main_json_with_students.json', 'w') as main_file:
    json.dump(main_json, main_file, indent=4)
