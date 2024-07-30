import React from 'react';
import { FileInput, Label } from 'flowbite-react';

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ onFileChange }: FileUploadProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <Label
          className="text-left block text-white font-semibold text-md"
          htmlFor="file-upload-helper-text"
          value="Upload University Students' Data File"
        />
      </div>
      <FileInput
        onChange={onFileChange}
        className="w-full"
        id="file-upload-helper-text"
        helperText="CSV Files Only*"
        accept=".csv"
      />
      <p className='text-center text-gray-400'>NOTE: Mandatory Fields - <b>Student University ID (SID)</b>, <b>First Name</b>, <b>Middle Name</b>, and <b>Last Name</b>. Make sure that the first 4 fields of the data to be uploaded are these fields.</p>
    </div>
  );
}
