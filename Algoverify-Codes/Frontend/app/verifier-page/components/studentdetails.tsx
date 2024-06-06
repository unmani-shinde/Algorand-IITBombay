"use client"
import React from 'react';

interface FormData {
    student_name: string;
  university: string;
  student_SID: string;
  student_grad_year: string;
}

interface StudentDetailsFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label htmlFor="student_name" className="block mb-2 text-sm font-medium text-white text-left">Custodian's Full Name</label>
        <input
          type="text"
          id="student_name"
          value={formData.student_name}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="John Doe"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="university" className="block mb-2 text-sm font-medium text-white text-left">Custodian's Graduating University Name</label>
        <input
          type="text"
          id="university"
          value={formData.university}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="XYZ University"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="student_SID" className="block mb-2 text-sm font-medium text-white text-left">Custodian's University ID</label>
        <input
          type="text"
          id="student_SID"
          value={formData.student_SID}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="100000"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="student_grad_year" className="block mb-2 text-sm font-medium text-white text-left">Custodian's Year of Graduation</label>
        <input
          type="text"
          id="student_grad_year"
          value={formData.student_grad_year}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="2025"
          required
        />
      </div>
      
    </form>
  );
};

export default StudentDetailsForm;
