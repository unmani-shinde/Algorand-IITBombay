export default async function ExportCSV(CID:String) {
    
    
    const URL = `https://ipfs.io/ipfs/${CID}`;
    try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csvText = await response.text();
  
        // Split the CSV text into an array of rows
        const rows = csvText.split('\n');
  
        // Parse the CSV rows into an array of arrays representing columns
        const csvData = rows.map(row => row.split(','));
  
        // Format the data into a CSV string
        const formattedCsv = csvData.map(row => row.join(',')).join('\n');
  
        // Create a Blob object from the formatted CSV string
        const blob = new Blob([formattedCsv], { type: 'text/csv' });

        return blob
    }catch(error){
        console.log("There was an error: ",error);
    }
    
}