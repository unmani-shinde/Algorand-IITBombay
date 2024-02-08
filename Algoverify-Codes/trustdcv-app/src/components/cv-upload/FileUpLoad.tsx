import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
export interface FileUploadProps {
  onChange: (files: any) => void;
  value: any;
}
export default function FileUpload(props: FileUploadProps) {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = function (files: any) {
    props.onChange(files);
  };

  return (
    <InputGroup
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e: any) => e.preventDefault()}
    >
      <InputGroup.Text id="basic-addon1">
        Attach CV for Referee Check:
      </InputGroup.Text>

      <Form.Control
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />

      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      ></label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </InputGroup>
  );
}
