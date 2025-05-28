import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inventory from './Inventory';
import Transaction from './Transaction';
import Login from './login';

function Home() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 p-6">
      <Link
        to="/inventory"
        className="w-full max-w-xs bg-navy hover:bg-navy-dark text-cream py-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-xl font-semibold"
      >
        <span className="text-4xl mb-2">📦</span>
        Inventory
      </Link>

      <Link
        to="/transaction"
        className="w-full max-w-xs bg-navy hover:bg-navy-dark text-cream py-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-xl font-semibold"
      >
        <span className="text-4xl mb-2">💻</span>
        Transaction
      </Link>

      <Link
        to="/visualization"
        className="w-full max-w-xs bg-navy hover:bg-navy-dark text-cream py-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-xl font-semibold"
      >
        <span className="text-4xl mb-2">📊</span>
        Data Visualization
      </Link>
    </div>
  );
}

function Visualization() {
  return <h1 className="text-center text-2xl mt-10 text-navy">📊 Data Visualization Page</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/visualization" element={<Visualization />} />

      </Routes>
    </Router>
  );
}

export default App;
