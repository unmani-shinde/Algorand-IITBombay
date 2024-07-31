"use client"
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface FormData {
  student_name: string;
  university: string;
  student_SID: string;
  student_grad_year: string;
  txID: string;
}

interface StudentDetailsFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };


  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction ID Information</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          The Transaction ID (TxID) is a unique identifier for a blockchain transaction. It's generated when a transaction is submitted to the network.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          To retrieve your Transaction ID, contact your University. Here's why it's stored with you:
        </p>
        <div className="flex justify-center">
          <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 mb-4">
            <li className="text-center">When the University uploads data, a transaction is submitted and a TxID is created.</li>
            <li className="text-center">This TxID is immediately shared with the University as they issue Degree certificates.</li>
            <li className="text-center">The TxID is used to retrieve and verify student records.</li>
            <li className="text-center">By keeping the id with you, it is completely secure from any tampering, even by us.</li>
          </ol>
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold mt-2 py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
  

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label htmlFor="student_name" className="block mb-2 text-sm font-medium text-white text-left">Custodian's Full Name</label>
        <input
          type="text"
          id="student_name"
          value={formData.student_name}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border placeholder-gray-400 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="John Doe"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="university" className="block mb-2 text-sm font-medium text-white text-left">Custodian's University Name</label>
        <input
          type="text"
          id="university"
          value={formData.university}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border placeholder-gray-400 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="XYZ University"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="student_SID" className="block mb-2 text-sm font-medium text-white text-left">Custodian's Student ID</label>
        <input
          type="text"
          id="student_SID"
          value={formData.student_SID}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border placeholder-gray-400 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
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
          className="shadow-sm bg-gray-50 border placeholder-gray-400 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="2025"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="txID" className="block mb-2 text-sm font-medium text-white text-left flex items-center">
          Transaction ID
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="ml-2 text-xs text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            <Info style={{ width: '18px', height: '18px' }} />
          </button>
        </label>
        <input
          type="text"
          id="txID"
          value={formData.txID}
          onChange={handleChange}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="LW37EI5DPKF72JRGDNZB3B3B76IGAAVZZ52RRDUFSIC2ASFHHWTA"
          required
        />
      </div>
      {isModalOpen && <Modal />}
    </form>
  );
};

export default StudentDetailsForm;