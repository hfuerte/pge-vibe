import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/usage/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => setMessage(`Error uploading file: ${error.message}`));
  };

  return (
    <div>
      <h2>Upload CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;
