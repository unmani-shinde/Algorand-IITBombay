import axios from 'axios';
import { config } from 'dotenv';

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MGRmZWZjMy1kMGM5LTRlNzktYTA1Yi1jYmM5ZGMyZjY1MDgiLCJlbWFpbCI6Im1haWx0by51bm1hbmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIxYWQ1NzA3MTY1YjgwNWY2ZGNmIiwic2NvcGVkS2V5U2VjcmV0IjoiNDZhZTI2NDc4ZjJlNTgzZWI2ZTU2NzUwMDI3MzFjYTA5NDhiNDY2MTk5MTJiODJlZDI5NTM5MTcyYzkzYTk5MSIsImlhdCI6MTcxNzU4ODcyM30.wWGZpn4rxr8U-iBBmClFqqAdiZi89sCVTbLRXxkm-Hw'

async function pinFiletoIPFS(file:Blob) {
    console.log("Uploading Main File");
		const formData = new FormData();
        console.log(file);
        
		formData.append('file', file)

    const pinataMetadata = JSON.stringify({
		  name: "meow",
		})
		formData.append('pinataMetadata',pinataMetadata);
		
		const pinataOptions = JSON.stringify({
		  cidVersion: 0,
		})
		formData.append('pinataOptions', pinataOptions);
	
		try{
            
            
		  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            
          headers: {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_JWT?.toString()}`
          }
		  });
          const university_hash = res.data.IpfsHash;
          console.log("Semi Private Database uploaded to: ",university_hash);
          

		} catch (error) {
		  console.log(error);
		}

    
}

export default pinFiletoIPFS