import { convertJsonToCsv } from "../page";

export const splitCSVByYear = async (mainFile: File) =>{
    let fileBlob = new Blob([mainFile as BlobPart]);
    const formData = new FormData();
    formData.append('file', fileBlob);
    try {
        const response = await fetch('http://127.0.0.1:5000/split-csv', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          const csvString = convertJsonToCsv(data);
          const blob = new Blob([csvString], { type: 'text/csv' });
        } else {
          console.error('Yearwise split failed.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
}
