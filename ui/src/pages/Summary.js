import React, { useState, useEffect } from 'react';

const Summary = () => {
  const [summaryData, setSummaryData] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTimeBlock = (startTime) => {
    const hour = parseInt(startTime.substring(0, 2), 10);
    if (hour >= 0 && hour <= 4) return 'part0'; // 12:00 AM - 4:59 AM
    if (hour >= 5 && hour <= 14) return 'part1'; // 5:00 AM - 2:59 PM
    if (hour >= 16 && hour <= 20) return 'part2'; // 4:00 PM - 8:59 PM
    if (hour === 15 || (hour >= 21 && hour <= 23)) return 'part3'; // 3:00 PM - 3:59 PM & 9:00 PM - 11:59 PM
    return null;
  };

  useEffect(() => {
    // Check for URL parameters from PDF upload
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const billingDays = urlParams.get('billingDays');

    if (startDate && endDate) {
      setDateRange({ startDate, endDate, billingDays });
    }

    loadSummaryData();
  }, []);

  const loadSummaryData = (customDateRange = null) => {
    setLoading(true);
    const range = customDateRange || dateRange;

    let url = '/api/usage/all';
    if (range && range.startDate && range.endDate) {
      // If we have a date range, we need to get data for all accounts in that range
      // For now, we'll fetch all data and filter client-side
      // In a real app, you might want to add a backend endpoint for date range filtering
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Filter data by date range if specified
        let filteredData = data;
        if (range && range.startDate && range.endDate) {
          const start = new Date(range.startDate.split('/').reverse().join('-'));
          const end = new Date(range.endDate.split('/').reverse().join('-'));

          filteredData = data.filter(record => {
            const recordDate = new Date(record.usageDate);
            return recordDate >= start && recordDate <= end;
          });
        }

        const summary = filteredData.reduce((acc, record) => {
          const period = range ? 'billing-period' : record.usageDate.substring(0, 7);
          const timeBlock = getTimeBlock(record.startTime);
          const hour = parseInt(record.startTime.substring(0, 2), 10);

          if (!timeBlock) return acc;

          if (!acc[period]) {
            acc[period] = {
              part0: { totalKwh: 0, totalCost: 0, hourly: {} },
              part1: { totalKwh: 0, totalCost: 0, hourly: {} },
              part2: { totalKwh: 0, totalCost: 0, hourly: {} },
              part3: { totalKwh: 0, totalCost: 0, hourly: {} },
            };
          }

          if (!acc[period][timeBlock].hourly[hour]) {
            acc[period][timeBlock].hourly[hour] = { totalKwh: 0, totalCost: 0 };
          }

          acc[period][timeBlock].totalKwh += record.usageKwh;
          acc[period][timeBlock].totalCost += record.cost;
          acc[period][timeBlock].hourly[hour].totalKwh += record.usageKwh;
          acc[period][timeBlock].hourly[hour].totalCost += record.cost;

          return acc;
        }, {});
        setSummaryData(summary);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching usage data:', error);
        setLoading(false);
      });
  };

  const formatMonth = (monthStr) => {
    if (monthStr === 'billing-period' && dateRange) {
      return `Billing Period: ${dateRange.startDate} to ${dateRange.endDate} (${dateRange.billingDays} days)`;
    }
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const clearDateRange = () => {
    setDateRange(null);
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    loadSummaryData(null);
  };

  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
    setSortConfig({ key: null, direction: 'ascending' });
  };

  const calculateTotals = (hourlyData) => {
    let totalKwh = 0;
    let totalCost = 0;
    for (const hour in hourlyData) {
      totalKwh += hourlyData[hour].totalKwh;
      totalCost += hourlyData[hour].totalCost;
    }
    return { totalKwh, totalCost };
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedHourlyData = (hourlyData) => {
    const sortableItems = Object.entries(hourlyData);
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[1][sortConfig.key] < b[1][sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[1][sortConfig.key] > b[1][sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
    }
    return null;
  };

  return (
    <div>
      <h2>{dateRange ? 'Billing Period Usage Summary' : 'Monthly Usage Summary'}</h2>

      {dateRange && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '4px'
        }}>
          <p><strong>Filtered by Billing Period:</strong> {dateRange.startDate} to {dateRange.endDate} ({dateRange.billingDays} days)</p>
          <button onClick={clearDateRange} style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Show All Monthly Data
          </button>
        </div>
      )}

      {loading && <p>Loading summary data...</p>}

      {Object.keys(summaryData).sort().map(month => (
        <div key={month}>
          <h3>{formatMonth(month)}</h3>
          <table>
            <thead>
              <tr>
                <th>Time Block</th>
                <th>Total Usage (kWh)</th>
                <th>Total Cost ($)</th>
              </tr>
            </thead>
            <tbody>
              {['part0', 'part1', 'part2', 'part3'].map((part, index) => {
                const rowId = `${month}-${part}`;
                const timeBlockLabels = [
                  '12:00 AM - 4:59 AM',
                  '5:00 AM - 2:59 PM',
                  '4:00 PM - 8:59 PM',
                  '3:00 PM - 3:59 PM & 9:00 PM - 11:59 PM'
                ];
                const hourlyTotals = calculateTotals(summaryData[month][part].hourly);
                return (
                  <React.Fragment key={rowId}>
                    <tr onClick={() => toggleRow(rowId)} style={{ cursor: 'pointer' }}>
                      <td>{timeBlockLabels[index]}</td>
                      <td>{summaryData[month][part].totalKwh.toFixed(2)}</td>
                      <td>{summaryData[month][part].totalCost.toFixed(2)}</td>
                    </tr>
                    {expandedRow === rowId && (
                      <tr>
                        <td colSpan="3">
                          <table>
                            <thead>
                              <tr>
                                <th>Hour</th>
                                <th onClick={() => requestSort('totalKwh')} style={{ cursor: 'pointer' }}>
                                  Total Usage (kWh){getSortIndicator('totalKwh')}
                                </th>
                                <th onClick={() => requestSort('totalCost')} style={{ cursor: 'pointer' }}>
                                  Total Cost ($){getSortIndicator('totalCost')}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedHourlyData(summaryData[month][part].hourly).map(([hour, data]) => (
                                <tr key={hour}>
                                  <td>{`${hour}:00 - ${hour}:59`}</td>
                                  <td>{data.totalKwh.toFixed(2)}</td>
                                  <td>{data.totalCost.toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr>
                                <td><strong>Total</strong></td>
                                <td><strong>{hourlyTotals.totalKwh.toFixed(2)}</strong></td>
                                <td><strong>{hourlyTotals.totalCost.toFixed(2)}</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              <tr>
                <td><strong>Monthly Total</strong></td>
                <td><strong>{(summaryData[month].part0.totalKwh + summaryData[month].part1.totalKwh + summaryData[month].part2.totalKwh + summaryData[month].part3.totalKwh).toFixed(2)}</strong></td>
                <td><strong>{(summaryData[month].part0.totalCost + summaryData[month].part1.totalCost + summaryData[month].part2.totalCost + summaryData[month].part3.totalCost).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Summary;
