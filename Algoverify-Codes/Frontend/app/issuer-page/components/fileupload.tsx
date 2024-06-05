import React from 'react';
import { FileInput, Label } from 'flowbite-react';

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ onFileChange }: FileUploadProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <Label
          className="text-white font-semibold text-left"
          htmlFor="file-upload-helper-text"
          value="Upload University Students' Data File"
        />
      </div>
      <FileInput
        onChange={onFileChange}
        className="w-7/12"
        id="file-upload-helper-text"
        helperText="CSV Files Only*"
        accept=".csv"
      />
    </div>
  );
}
