import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Accounts from './pages/Accounts';
import AllUsage from './pages/AllUsage';
import UsageByAccount from './pages/UsageByAccount';
import Upload from './pages/Upload';
import DeleteData from './pages/DeleteData';
import Summary from './pages/Summary';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>PGE Vibe</h1>
        </header>
        <NavigationBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Accounts />} />
            <Route path="/all-usage" element={<AllUsage />} />
            <Route path="/usage-by-account" element={<UsageByAccount />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/delete-data" element={<DeleteData />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
