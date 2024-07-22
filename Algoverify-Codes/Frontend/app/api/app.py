from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import unquote
import pandas as pd
from create_spdf.create_database import main
from verify_record.verify_record import verify
from update_spdf.update_db import process_csv, create_semi_private_database
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/get-uni-cid', methods=["POST"])
def get_CID():
    super_database = request.files.get('super_database')
    university = request.args.get('university')

    if not super_database:
        return jsonify({"error": "No file uploaded"}), 400

    if not university:
        return jsonify({"error": "No university specified"}), 400

    super_database_df = pd.read_csv(super_database)
    university = university.strip()

    # Check if the university exists in the DataFrame
    if university not in super_database_df['Name of University:'].values:
        return jsonify({"cid": "-1"}), 200

    # Find the UCID for the given university
    row = super_database_df[super_database_df['Name of University:'] == university]
    if not row.empty:
        cid = str(row.iloc[0]['University Content Identifier (UCID):'])
    else:
        cid = "-1"

    return jsonify({"cid": cid}), 200




@app.route('/dun-dun-dun',methods=["POST"])
def update_SCID_DB():
    scid_database = request.files.get('scid_database')
    university = request.args.get('university')
    print("University name:",university)
    ucid = request.args.get('ucid')
    university = university.strip()
    scid_database = pd.read_csv(scid_database)

    print("df values: ", scid_database["Name of University:"].values)
    if (university not in scid_database["Name of University:"].values):
        new_data = [{"ID:":str(scid_database.shape[0]+1),"Name of University:":university,"University Content Identifier (UCID):":ucid}]
        new_data = pd.DataFrame(new_data)
        scid_database = scid_database._append(new_data)
        json_response = scid_database.to_json(orient='records')
        print(json_response)
        return json_response, 200
    else:
        cid = "-1"
        return jsonify({'cid': cid}), 200



@app.route('/verifier-page', methods=['POST'])
def get_verified():
    database = request.files.get('database')
    student_name = unquote(request.args.get('student_name'))
    student_sid = request.args.get('student_SID')
    student_grad_year = request.args.get('student_grad_year')
    

    if not database or not student_name or not student_sid or not student_grad_year:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:

        verification_result, timestamp = verify(database, student_name, student_sid, student_grad_year)
        
        return jsonify({
            'verified': verification_result,
            'timestamp': timestamp if verification_result else None
        })
    
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        print(traceback.format_exc())  # This will print the full traceback
        return jsonify({'error': str(e)}), 500


@app.route('/issuer-page', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        database = main(file)
        json_response = database.to_json(orient='records')
        return json_response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 501

@app.route('/update-page', methods=['POST'])
def update_file():
    newfile = request.files.get('newCSV')
    if newfile.filename == '':
        return jsonify({'error': 'No new file selected'}), 400
    
    oldfile = request.files.get('oldCSV')
    if oldfile.filename == '':
        return jsonify({'error': 'No old file selected'}), 400

    # Read the already processed old file
    old_spdb = pd.read_csv(oldfile)

    # Process new file
    new_df = process_csv(newfile)
    new_spdb = create_semi_private_database(new_df, start_index=len(old_spdb))

    # Combine old and new semi-private databases
    combined_spdb = pd.concat([old_spdb, new_spdb])
    json_response = combined_spdb.to_json(orient='records')

    # Return the combined CSV file
    return json_response, 200

@app.route('/update-ucid', methods=['POST'])
def update_ucid():
    ucid_map = request.files.get('ucid-map')
    if ucid_map.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    sciddf = pd.read_csv(ucid_map)
    university = request.args.get('university', '').strip()
    newucid = request.args.get('ucid', '').strip()

    if not university or not newucid:
        return jsonify({'error': 'Missing university or new UCID parameter'}), 400

    if university not in sciddf['Name of University:'].values:
        return jsonify({'error': 'University not found'}), 404

    sciddf.loc[sciddf['Name of University:'] == university, 'University Content Identifier (UCID):'] = newucid

    json_response = sciddf.to_json(orient='records')

    return json_response, 200

@app.route('/updateTransactions', methods=['POST'])
def update_transactions():
    ucid = request.args.get('ucid', '').strip()
    graduation_year = request.args.get('gradYear', '').strip()
    TxID = request.args.get('txid', '').strip()
    tcid = request.args.get('tcid', '').strip()
    #retrieve table from tcid
    #add values to table
    #return new file 


if __name__ == '__main__':
    app.run(debug=True)
