//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Certificate {
    address public universityAddress;
    mapping(address => mapping(string => bool)) public issuedCertificates;

    event CertificateIssued(address indexed student, string certificateDetails);

    constructor() {
        universityAddress = msg.sender;
    }

    modifier onlyUniversity() {
        require(msg.sender == universityAddress, "Only the university can call this function");
        _;
    }

    function issueCertificate(address student, string memory certificateDetails) public onlyUniversity {
        require(!issuedCertificates[student][certificateDetails], "Certificate with the same details already issued for this student");

        issuedCertificates[student][certificateDetails] = true;
        emit CertificateIssued(student, certificateDetails);
    }
}
