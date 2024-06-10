export default async function deleteFromIPFS(old_scid:string) {
    const fetch = (await import("node-fetch")).default;
    try {
        const response = await fetch(
          `https://api.pinata.cloud/pinning/unpin/${old_scid}`,
          {
            method: "DELETE",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_JWT?.toString()}`,
            },
          }
        );
        if(!response.ok){
            console.log("Database Deletion unsuccessful.");
            
        }
        else{console.log("Deleted Original DB successfully!");}
        
        
      } catch (error) {
        console.log(error);
      }
    
    
    
    
  
    
}