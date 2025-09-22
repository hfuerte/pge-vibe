import React, { useState } from 'react';

const UsageByAccount = () => {
  const [accountId, setAccountId] = useState('');
  const [usage, setUsage] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`/api/usage/account/${accountId}`)
      .then(response => response.json())
      .then(data => setUsage(data))
      .catch(error => console.error('Error fetching usage data:', error));
  };

  return (
    <div>
      <h2>Usage By Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={accountId}
          onChange={e => setAccountId(e.target.value)}
          placeholder="Enter Account ID"
        />
        <button type="submit">Get Usage</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Usage (kWh)</th>
            <th>Cost</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {usage.map(item => (
            <tr key={item.id}>
              <td>{item.accountId}</td>
              <td>{item.usageDate}</td>
              <td>{item.startTime}</td>
              <td>{item.endTime}</td>
              <td>{item.usageKwh}</td>
              <td>{item.cost}</td>
              <td>{item.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsageByAccount;
