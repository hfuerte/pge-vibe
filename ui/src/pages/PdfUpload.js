import React, { useState } from 'react';

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setBillingInfo(null);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a PDF file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/usage/upload-statement', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setBillingInfo(data);
        setMessage('Successfully extracted billing period information!');
      } else {
        setMessage(`Error: ${data.message}`);
        setBillingInfo(null);
      }
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
      setBillingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = () => {
    if (billingInfo) {
      // Navigate to Summary page with date range parameters
      const params = new URLSearchParams({
        startDate: billingInfo.startDate,
        endDate: billingInfo.endDate,
        billingDays: billingInfo.billingDays
      });
      window.location.href = `/summary?${params.toString()}`;
    }
  };

  return (
    <div>
      <h2>Upload PGE Statement (PDF)</h2>
      <p>Upload a PGE billing statement PDF to extract the billing period information.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Processing...' : 'Extract Billing Period'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: billingInfo ? '#d4edda' : '#f8d7da',
          border: `1px solid ${billingInfo ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {billingInfo && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <h3>Extracted Billing Information:</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Start Date:</strong> {billingInfo.startDate}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>End Date:</strong> {billingInfo.endDate}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Billing Days:</strong> {billingInfo.billingDays}
          </div>

          <button
            onClick={handleViewSummary}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Usage Summary for This Period
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;