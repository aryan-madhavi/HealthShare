import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { convertImageToPdf } from "../HelperFuctions/ConvertImagetoPdf";
import { QRCodeSVG } from 'qrcode.react';

function Home() {
    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null);

    function removeExtension(filename) {
        return filename.replace(/\.[^/.]+$/, ""); // removes last dot + extension
    }


    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(selected.type)) {
            alert("Only JPG, PNG, and PDF files are allowed!");
            e.target.value = "";
            return;
        }
        setFile(selected);
        }
    };


    const handleSubmit = async (e) => {
    e.preventDefault();
    let fileToUpload = file;

    if (!file) {
      alert("Please select a valid file first!");
      return;
    }

    try {

        if (file.type.startsWith("image/")) {
            // Convert image to PDF if it's an image file
            fileToUpload = await convertImageToPdf(file);   
        }
        
        const baseName = removeExtension(fileToUpload.name);

        // Create a storage reference (filename)
        const storageRef = ref(storage, `${baseName}-${Date.now()}`);


        // Upload the file
        await uploadBytes(storageRef, fileToUpload);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        setUrl(downloadURL);

        // alert("File fuploaded successfully!");
        console.log("Download URL:", downloadURL);
    } catch (error) {
        console.error("Upload failed", error);
        alert("Upload failed!");
    }
 
  };

    return(
        <>
            <Form onSubmit={handleSubmit}>
                <p>Home</p>
                <Form.Group controlId="formFile" className="mb-3 form-control">
                    <Form.Label>Upload File</Form.Label>
                    <Form.Control 
                        type="file" 
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileChange}
                        />
                </Form.Group>

                <Button variant="primary" type="submit" >
                    Submit
                </Button>

                {url && (
                    <div className="mt-3">
                        <p>✅ File uploaded:</p>
                        <QRCodeSVG value={url} size={128} />
                    </div>
                )}
                
            </Form>
        </>
    );
}

export default Home;