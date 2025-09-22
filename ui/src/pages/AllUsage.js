import React, { useState, useEffect } from 'react';

const AllUsage = () => {
  const [usage, setUsage] = useState([]);
  const [filteredUsage, setFilteredUsage] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetch('/api/usage/all')
      .then(response => response.json())
      .then(data => {
        setUsage(data);
        setFilteredUsage(data);
      })
      .catch(error => console.error('Error fetching usage data:', error));
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = usage.filter(item => {
        // Parse month from YYYY-MM-DD string to avoid timezone issues
        const itemMonth = parseInt(item.usageDate.substring(5, 7), 10);
        return itemMonth === parseInt(selectedMonth, 10);
      });
      setFilteredUsage(filtered);
    } else {
      setFilteredUsage(usage);
    }
  }, [selectedMonth, usage]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div>
      <h2>All Usage Data</h2>
      <select onChange={handleMonthChange} value={selectedMonth}>
        <option value="">All Months</option>
        {months.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
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
          {filteredUsage.map(item => (
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

export default AllUsage;
