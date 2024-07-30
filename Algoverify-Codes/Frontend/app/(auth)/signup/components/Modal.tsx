
"use client";

import { Button, Modal, Select } from "flowbite-react";
import { useState } from "react";

// components/Modal.tsx
import React from 'react';

interface TrustIDModalProps {
  showModal: boolean;
  walletAddress: string;
  walletTxn: string;
  trustID: string;
  onClose: () => void;
}

const TrustIDModal: React.FC<TrustIDModalProps> = ({ showModal, walletAddress, walletTxn,trustID, onClose }) => {
  if (!showModal) return null;

  return (

    <Modal show={showModal} onClose={onClose}>
        <Modal.Header><p className="font-bold">AlGOTrust Notification </p></Modal.Header>
        <Modal.Body>
          <h1 className="text-center text-lg font-bold text-black">Registration Successful!</h1>
          <div className="space-y-6 p-1">
        <h3 className="text-black text-md"><strong >Wallet Address:</strong> {walletAddress}</h3>
        <h3 className="text-black text-md"><strong >Wallet Login ID:</strong> {walletTxn}</h3>
        <h3 className="text-black text-md"><strong >ALGOTrustID:</strong> {trustID}</h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="font-semibold" color="purple" onClick={onClose}>I have noted my ID</Button>
          
        </Modal.Footer>
      </Modal>





   
  );
};

export default TrustIDModal;



