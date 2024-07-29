
"use client";

import { Button, Modal, Select } from "flowbite-react";
import { useState } from "react";

export interface ModalActions {
    showModal: boolean;
    trustID: string
}


export default function TrustIDModal({showModal,trustID}:ModalActions) {
  
  const [modalSize, setModalSize] = useState<string>('md');

  const handleCloseModal = () =>{
    showModal = !showModal;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">

      </div>
      <Modal show={showModal} onClose={handleCloseModal}>
        <Modal.Header>AlGOTrust ID Notification</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
          <h1 className="text-center mb-4 text-xl font-extrabold tracking-tight leading-none text-gray-900 md:text-xl lg:text-xl dark:text-white">
            Your ALGOTrust ID is:
          </h1>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              ID: {trustID}
            </p>
            <p className="text-base text-center leading-relaxed text-gray-500 dark:text-gray-400">
              Please note down this ID, to access your issued credentials, this will not be shown again.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="font-semibold" color="purple" onClick={handleCloseModal}>I have noted my ID</Button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
}
