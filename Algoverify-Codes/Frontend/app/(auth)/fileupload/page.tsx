'use client'
import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    // Open the file in a new tab
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  };

//   const handleSubmit = () => {
//     const fileArray = new FileList(selectedFiles, '');
//     onUpload(fileArray);
//     // Optionally, you can reset the input field
//     setSelectedFiles([]);
//   };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>
        <h2 className="text-xl font-semibold mb-4">Issue Documents</h2>
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Select Files
          </label>
          <div className="mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {selectedFiles.length > 0 ? (
              <ul className="list-disc ml-4">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center mt-1">
                    <div className="bg-gray-100 text-black p-2 rounded-md flex-grow max-w-96 overflow-hidden whitespace-nowrap">
                      {file.name}
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 ml-2"
                    >
                      &#10006;
                    </button>
                    <button
                      onClick={() => handleViewFile(file)}
                      className="text-blue-500 ml-2"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              'No files selected'
            )}
          </div>
        </div>
        <button
        //   onClick={handleSubmit}
          disabled={selectedFiles.length === 0}
          className={`${
            selectedFiles.length > 0
              ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white py-2 px-4 rounded-md`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
