<h1 align="center">
  ALGOTrust 🪪🔏
</h1>

<div align="center">
  Security and Verification of Educational Credentials on the <strong>Algorand Blockchain</strong>.<br>
  Project <strong>MEGA-ACE</strong> || Multi-disciplinary Educational Global Alliance for Algorand Centre of Excellence
</div>

Frontend:
 - Landing page
 - Registration
 - Sign in
 - Issuer page
 - Verifier page

Backend:
 - Flask server
 - Algorand smart contracts:
  - contract
  - abi (contract.json)
  - reset_scid.py: to manually change value of global state

Test-data:
 - Sample University student records
 - issuer_texts: stores TxID + Batch for all tests done so far

#How it works:
 - Pinata storage available and working
 - Blockchain wallet with admin access funded

Universities' role:
 - University registers through official email [list of verified emails needed]
 - Upload all previous data in bulk (One-time upon sign up)
 - Every year, as new batch graduates, records are added
 - Every data upload produces TxID which is supposed to be saved and shared with students

Students' role:
 - Share TxID with employer when applying (add to your Resume)

Employer's role:
 - Use student details + TxID provided by applicant to verify details


<hr/>