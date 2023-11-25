import React, { useState } from "react";
import ImageRenderer from "./ImageRenderer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function App() {
  const [mate1, setMate1] = useState(null);
  const [name1, setName1] = useState(null);
  const [mail1, setMail1] = useState(null);

  const [mate2, setMate2] = useState(null);
  const [name2, setName2] = useState(null);
  const [mail2, setMail2] = useState(null);

  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [status, setStatus] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    setStatus(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", inputKey);
    formData.append("mail", inputValue);

    try {
      const response = await fetch("http://127.0.0.1:8803/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
        // Handle success as needed
      } else {
        console.error("Failed to upload file");
        // Handle error
      }
    } catch (error) {
      console.error("Error occurred while uploading:", error);
      // Handle error
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "key") {
      setInputKey(e.target.value);
    } else if (e.target.name === "value") {
      setInputValue(e.target.value);
    }
  };

  // const fetchData = async () => {
  //   try {
  //     // Create an object with key-value pairs from input fields
  //     const payload = {
  //       [inputKey]: inputValue,
  //       // query: "SELECT * from groceryDemo;",
  //     };

  //     const response = await fetch("http://127.0.0.1:8803/query", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //     // .then(console.log(response));

  //     // const result = await response;
  //     const result = await response.json();
  //     var myObject = JSON.parse(result["api response"]);
  //     // console.log(myObject["data"][0]);
  //     setData(myObject["data"][0]);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      // Create an object with key-value pairs from input fields
      // const payload = {
      //   name: inputKey,
      //   mail: inputValue,
      //   file: "testing",
      // };

      const formData = new FormData();
      console.log(selectedFile.name);
      formData.append("filename", selectedFile.name);

      const response = await fetch("http://127.0.0.1:8803/mate", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Find mate!");
        // Handle success as needed
      } else {
        console.error("Failed to find mate");
        // Handle error
      }
      // } catch (error) {
      //   console.error("Error occurred while uploading:", error);
      //   // Handle error
      // }

      // const response = await fetch("http://127.0.0.1:8803/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });
      // .then(console.log(response));

      // const result = await response;
      const result = await response.json();
      var myObject = JSON.parse(result["response"]);
      setMate1(myObject["data"][0]);
      setName1(myObject["name"][0]);
      setMail1(myObject["gmail"][0]);

      setMate2(myObject["data"][1]);
      setName2(myObject["name"][1]);
      setMail2(myObject["gmail"][1]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {
        <>
          <h1>Welcome to FaceDate!</h1>
        </>
      }
      {status == false ? (
        <>
          <TextField
            type="text"
            name="key"
            value={inputKey}
            onChange={handleInputChange}
            placeholder="Enter name..."
            style={{ margin: 10 }}
          />
          <TextField
            type="text"
            name="value"
            value={inputValue}
            onChange={handleInputChange}
            style={{ margin: 10 }}
            placeholder="Enter mail..."
          />
          <TextField
            style={{ margin: 10 }}
            type="file"
            onChange={handleFileChange}
          />
          <Button
            style={{ margin: 10, marginTop: 15 }}
            variant="contained"
            onClick={handleFileUpload}
          >
            Register!
          </Button>
        </>
      ) : (
        <>
          <Button
            style={{ margin: 10 }}
            variant="contained"
            onClick={fetchData}
          >
            Find my mate!
          </Button>
        </>
      )}

      {mate1 && mate2 && (
        <div>
          <h2>Your Mate!</h2>
          <div>
            <ImageRenderer imageArray={mate1} />
            <h2>Name: {name1}</h2>
            <h2>Mail: {mail1}</h2>
          </div>
          <div>
            <ImageRenderer imageArray={mate2} />
            <h2>Name: {name2}</h2>
            <h2>Mail: {mail2}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
