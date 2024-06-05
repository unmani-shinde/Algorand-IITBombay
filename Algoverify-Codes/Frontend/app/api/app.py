from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors module
import pandas as pd
from create_spdf.create_database import main

app = Flask(__name__)
CORS(app)
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
