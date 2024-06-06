'use client'
import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [userInput, setUserInput] = useState('');  // State to hold the user input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleViewFile = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center w-full max-w-md p-4 rounded-lg shadow-md">
        <h2 className="text-4xl text-center font-semibold mb-6">Help your alumni. Upload files below.</h2>
        <h2 className="text-lg text-center mb-12">Make sure it's in .csv format and the first 2 fields are the Student ID and Name, in that order. We'll handle the rest</h2>
        <div className="mb-12">
          <div className="text-center mb-12">
            <label className="block font-medium mb-2">Enter data fields (columns in data, seperated by semicolons):</label>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm"
              placeholder="Type here..."
            />
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-purple-600 text-white py-3 px-16 rounded-md hover:bg-purple-700 mb-16"
          >
            Select Files
          </label>
          <div className="mt-8" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {selectedFiles.length > 0 ? (
              <ul className="list-disc">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center mt-2 space-x-2">
                    <div className="bg-gray-100 text-black p-2 rounded-md flex-grow truncate">
                      {file.name}
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500"
                    >
                      &#10006;
                    </button>
                    <button
                      onClick={() => handleViewFile(file)}
                      className="text-blue-500"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500">No files selected</div>
            )}
          </div>
        </div>
        <button
          disabled={selectedFiles.length === 0}
          className={`${
            selectedFiles.length > 0
              ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white py-2 px-4 rounded-md mt-2`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FileUpload;