import axios from 'axios';

async function pinFiletoIPFS(file:Blob,file_name:String) {
	
    console.log("Uploading Main File");
		const formData = new FormData();
        console.log(file);
        
		formData.append('file', file)

    const pinataMetadata = JSON.stringify({
		  name: file_name,
		})
		formData.append('pinataMetadata',pinataMetadata);
		
		const pinataOptions = JSON.stringify({
		  cidVersion: 0,
		})
		formData.append('pinataOptions', pinataOptions);
	
		try{
            
			  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
				method: "POST",
				headers: {
				  Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_JWT}`,
				},
				body: formData,
			  });
			  
		  const resData = await res.json();
		  console.log(resData); 
          const  university_hash  = resData.IpfsHash;
          console.log("Semi Private Database uploaded to: ",university_hash);
		  //addCidToAlgorand(university_hash);
		  return university_hash

		} catch (error) {
		  console.log("pin file error", error);
		}

    
}

export default pinFiletoIPFS