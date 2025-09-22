import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Accounts</Link></li>
        <li><Link to="/all-usage">All Usage</Link></li>
        <li><Link to="/usage-by-account">Usage By Account</Link></li>
        <li><Link to="/upload">Upload CSV</Link></li>
        <li><Link to="/pdf-upload">Upload PDF Statement</Link></li>
        <li><Link to="/delete-data">Delete Data</Link></li>
        <li><Link to="/summary">Summary</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
