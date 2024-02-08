# import hashlib
# import secrets
# import xml.etree.ElementTree as ET

# def append_nonce_to_hash(data):
#     # Generate a random nonce
#     nonce = secrets.token_hex(16)
#     data = data + nonce
#     # Create a hash object
#     hash_object = hashlib.sha256()

#     # Update the hash with the data
#     hash_object.update(data.encode('utf-8'))

#     # Final hash
#     final_hash = hash_object.hexdigest()

#     return nonce, final_hash

# def read_data_from_xml(file_path):
#     tree = ET.parse(file_path)
#     root = tree.getroot()
#     student_element = root.find("student")
#     name = student_element.find("name").text.strip()
#     rollno = student_element.find("rollno").text.strip()
#     university = student_element.find("university").text.strip()
#     program = student_element.find("program").text.strip()
#     year = student_element.find("year").text.strip()
#     gpa = student_element.find("gpa").text.strip()
#     data = f"{name}-{rollno}-{university}-{program}-{year}-{gpa}"
#     return data

# # Specify the path to your XML file
# xml_file_path = "./DegreeS1.xml"

# # Read data from the XML file
# data = read_data_from_xml(xml_file_path)

# # Calculate the nonce and final hash
# nonce, final_hash = append_nonce_to_hash(data)

# print("Data:", data)
# print("Nonce:", nonce)
# print("Hash with Nonce:", final_hash)



# import hashlib
# import secrets
# import xml.etree.ElementTree as ET

# def append_nonce_to_hash(data):
#     # Generate a random nonce
#     nonce = secrets.token_hex(16)
#     data = data + nonce
#     # Create a hash object
#     hash_object = hashlib.sha256()

#     # Update the hash with the data
#     hash_object.update(data.encode('utf-8'))

#     # Final hash
#     final_hash = hash_object.hexdigest()

#     return nonce, final_hash

# def read_data_from_xml(file_path):
#     tree = ET.parse(file_path)
#     root = tree.getroot()
#     student_element = root.find("student")
#     name = student_element.find("name").text.strip()
#     rollno = student_element.find("rollno").text.strip()
#     university = student_element.find("university").text.strip()
#     program = student_element.find("program").text.strip()
#     year = student_element.find("year").text.strip()
#     gpa = student_element.find("gpa").text.strip()
#     data = f"{name}-{rollno}-{university}-{program}-{year}-{gpa}"
#     return data

# # Specify the paths to your XML files for each student
# xml_file_paths = [
#     "./DegreeS1.xml",
#     "./DegreeS2.xml",
#     "./DegreeS3.xml",
# ]

# results = []

# # Process each XML file
# for xml_file_path in xml_file_paths:
#     # Read data from the XML file
#     data = read_data_from_xml(xml_file_path)

#     # Calculate the nonce and final hash
#     nonce, final_hash = append_nonce_to_hash(data)

#     # Store the results
#     result = {
#         "file_path": xml_file_path,
#         "data": data,
#         "nonce": nonce,
#         "final_hash": final_hash
#     }
#     results.append(result)

# # Print the results for each student
# for result in results:
#     # print("File Path:", result["file_path"])
#     print("Data:", result["data"])
#     print("Nonce:", result["nonce"])
#     print("Hash with Nonce:", result["final_hash"])
#     print()


# # Combine the final hashes of all students
# combined_hash_data = "".join(result["final_hash"] for result in results)
# combined_final_hash = hashlib.sha256(combined_hash_data.encode('utf-8')).hexdigest()

# print("Students Root Hash:")
# print(combined_final_hash)

import hashlib
import secrets
import xml.etree.ElementTree as ET

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

def append_nonce_to_hash(data):
    nonce = secrets.token_hex(16)
    data = data + nonce
    hash_object = hashlib.sha256()
    hash_object.update(data.encode('utf-8'))
    final_hash = hash_object.hexdigest()
    return nonce, final_hash

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

# Process each XML file
for xml_file_path in xml_file_paths:
    name, rollno, university, program, year, gpa, data = read_data_from_xml(xml_file_path)
    nonce, final_hash = append_nonce_to_hash(data)
    final_hashes.append(final_hash)
    student_details.append((name, rollno, university, program, year, gpa, nonce))

merkle_root = calculate_merkle_root(final_hashes)

print("Merkle Root:")
print(merkle_root)

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
