import axios from 'axios';

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