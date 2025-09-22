import React, { useState, useEffect } from 'react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('/api/usage/accounts')
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(error => console.error('Error fetching accounts:', error));
  }, []);

  return (
    <div>
      <h2>Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Account Number</th>
            <th>Service Type</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.accountNumber}>
              <td>{account.name}</td>
              <td>{account.address}</td>
              <td>{account.accountNumber}</td>
              <td>{account.serviceType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;
