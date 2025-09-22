import React, { useState } from 'react';

const DeleteData = () => {
  const [message, setMessage] = useState('');

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete all usage data?')) {
      fetch('/api/usage/all', {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setMessage('All usage data deleted successfully.');
          } else {
            setMessage('Error deleting data.');
          }
        })
        .catch(error => setMessage(`Error deleting data: ${error.message}`));
    }
  };

  return (
    <div>
      <h2>Delete All Data</h2>
      <button onClick={handleDelete}>Delete All Usage Data</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteData;
