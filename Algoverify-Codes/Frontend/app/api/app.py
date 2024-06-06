from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors module
from urllib.parse import unquote
import pandas as pd
from create_spdf.create_database import main
from verify_record.verify_record import verify

app = Flask(__name__)
CORS(app)

@app.route('/verifier-page', methods=['POST'])
def get_verified():
    database = request.files.get('database')
    print(database)
    student_name = unquote(request.args.get('student_name'))
    student_sid = request.args.get('student_SID')
    student_grad_year = request.args.get('student_grad_year')
    

    if not database or not student_name or not student_sid or not student_grad_year:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        # Assuming verify is a function defined elsewhere
        record_verification = verify(database, student_name, student_sid, student_grad_year)
        return str(record_verification)
        # # Process record_verification further if needed
        # return jsonify({'result': 'Record verification successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/issuer-page', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    print(request.files)
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        database = main(file)
        json_response = database.to_json(orient='records')
        return json_response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
