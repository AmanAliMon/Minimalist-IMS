// Paste the updated code below into your file:

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const initialProducts = [
  { id: 1, name: 'Toyota Corolla', class: 'Sedan', price: 1200000, quantity: 5 },
  { id: 2, name: 'Honda Civic', class: 'Sedan', price: 1500000, quantity: 3 },
  { id: 3, name: 'Ford F-150', class: 'Truck', price: 2500000, quantity: 2 },
  { id: 4, name: 'Tesla Model 3', class: 'Electric', price: 3500000, quantity: 4 },
  { id: 5, name: 'Jeep Wrangler', class: 'SUV', price: 3000000, quantity: 1 },
];

export default function Transaction() {
  const [products] = useState(initialProducts);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(0);
  const [sold, setSold] = useState([]);
  const [payment, setPayment] = useState('');

  const filteredProducts = useMemo(
    () =>
      products.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [products, filter]
  );

  const totalPrice = sold.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const change = payment ? Math.max(Number(payment) - totalPrice, 0) : 0;

  const addItem = () => {
    if (!selected || qty <= 0) return;
    setSold(prev => {
      const existing = prev.find(i => i.id === selected.id);
      if (existing) {
        return prev.map(i =>
          i.id === selected.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...selected, quantity: qty }];
    });
    setQty(0);
  };

  const removeItem = () => {
    if (!selected) return;
    setSold(prev => prev.filter(i => i.id !== selected.id));
    setSelected(null);
    setQty(0);
  };

  const saveTransaction = () => {
    console.log('Transaction saved:', sold);
    setSold([]);
    setPayment('');
    setSelected(null);
    setQty(0);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col lg:flex-row gap-4" style={{ backgroundColor: '#EAEFEF' }}>
      {/* LEFT COLUMN */}
      <div className="flex-1 space-y-4 p-2 rounded-lg border" style={{ backgroundColor: '#EAEFEF', borderColor: '#B8CFCE' }}>
        {/* Available Products */}
        <div className="rounded-lg overflow-x-auto border" style={{ borderColor: '#B8CFCE' }}>
          <h2 className="text-2xl font-bold text-center py-2 rounded-t-lg" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>
            Available Cars
          </h2>
          <table className="w-full table-auto min-w-[600px]" style={{ color: '#333446' }}>
            <thead>
              <tr style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>
                <th className="py-1 px-2">Car Model</th>
                <th className="py-1 px-2">Type</th>
                <th className="py-1 px-2">Price</th>
                <th className="py-1 px-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`text-center cursor-pointer`}
                  style={{
                    backgroundColor: selected?.id === p.id
                      ? '#333446'
                      : idx % 2
                      ? '#EAEFEF'
                      : '#B8CFCE',
                    color: selected?.id === p.id ? '#EAEFEF' : '#333446'
                  }}
                  onClick={() => setSelected(p)}
                >
                  <td className="py-1 px-2">{p.name}</td>
                  <td className="py-1 px-2">{p.class}</td>
                  <td className="py-1 px-2">Rs {p.price.toLocaleString()}</td>
                  <td className="py-1 px-2">{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products to be Sold */}
        <div className="rounded-lg overflow-x-auto border" style={{ borderColor: '#B8CFCE' }}>
          <h2 className="text-2xl font-bold text-center py-2 rounded-t-lg" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>
            Cars to be Sold
          </h2>
          <table className="w-full table-auto min-w-[600px]" style={{ color: '#333446' }}>
            <thead>
              <tr style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>
                <th className="py-1 px-2">Car Model</th>
                <th className="py-1 px-2">Type</th>
                <th className="py-1 px-2">Price</th>
                <th className="py-1 px-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {sold.map(s => (
                <tr key={s.id} className="text-center" style={{ backgroundColor: '#B8CFCE' }}>
                  <td className="py-1 px-2">{s.name}</td>
                  <td className="py-1 px-2">{s.class}</td>
                  <td className="py-1 px-2">Rs {s.price.toLocaleString()}</td>
                  <td className="py-1 px-2">{s.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-96 rounded-lg p-4 space-y-4" style={{ backgroundColor: '#EAEFEF', color: '#333446', border: '1px solid #B8CFCE' }}>
        <Link
          to="/"
          className="block text-center rounded-full py-1 font-bold"
          style={{ backgroundColor: '#333446', color: '#EAEFEF' }}
        >
          ← Go Back
        </Link>

        <h2 className="text-3xl font-bold text-center">Transaction</h2>

        <div className="space-y-3">
          {/* Selected Item */}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="col-span-1 py-1 px-2 rounded" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>
              Selected Car
            </label>
            <div className="col-span-2 py-1 px-2 rounded text-center" style={{ backgroundColor: '#B8CFCE' }}>
              {selected ? selected.name : 'None'}
            </div>
          </div>

          {/* Filter */}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="col-span-1 py-1 px-2 rounded" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>Filter</label>
            <input
              type="text"
              className="col-span-2 py-1 px-2 rounded"
              style={{ backgroundColor: '#EAEFEF', border: '1px solid #B8CFCE', color: '#333446' }}
              placeholder="Search a Car"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="col-span-1 py-1 px-2 rounded" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>Quantity</label>
            <input
              type="number"
              min="0"
              className="col-span-2 py-1 px-2 rounded"
              style={{ backgroundColor: '#EAEFEF', border: '1px solid #B8CFCE', color: '#333446' }}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
            />
          </div>

          {/* Add Item Button */}
          <button
            className="w-full py-2 rounded font-semibold transition duration-200"
            style={{
              backgroundColor: selected && qty > 0 ? '#333446' : '#7F8CAA',
              color: '#EAEFEF',
              cursor: selected && qty > 0 ? 'pointer' : 'not-allowed'
            }}
            onClick={() => {
              if (selected && qty > 0) addItem();
            }}
          >
            Add Item
          </button>

          {/* Remove Item */}
          <button
            className="w-full py-2 rounded font-semibold"
            style={{
              backgroundColor: '#7F8CAA',
              color: '#EAEFEF',
              cursor: selected ? 'pointer' : 'not-allowed',
              opacity: selected ? 1 : 0.5
            }}
            onClick={removeItem}
            disabled={!selected}
          >
            Remove Item
          </button>

          {/* Total Price */}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="col-span-1 py-1 px-2 rounded" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>
              Total Price
            </label>
            <div className="col-span-2 py-1 px-2 rounded text-right" style={{ backgroundColor: '#B8CFCE' }}>
              Rs {totalPrice.toLocaleString()}
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="col-span-1 py-1 px-2 rounded" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>Payment</label>
            <input
              type="number"
              className="col-span-2 py-1 px-2 rounded"
              style={{ backgroundColor: '#EAEFEF', border: '1px solid #B8CFCE', color: '#333446' }}
              value={payment}
              onChange={e => setPayment(e.target.value)}
            />
          </div>

          {/* Change */}
          <div className="grid grid-cols-3 items-center gap-2">
            <label className="col-span-1 py-1 px-2 rounded" style={{ backgroundColor: '#333446', color: '#EAEFEF' }}>Change</label>
            <div className="col-span-2 py-1 px-2 rounded text-right" style={{ backgroundColor: '#B8CFCE' }}>
              Rs {change.toLocaleString()}
            </div>
          </div>

          {/* Save Transaction */}
          <button
            className="w-full py-2 rounded font-bold"
            style={{ backgroundColor: '#333446', color: '#EAEFEF' }}
            onClick={saveTransaction}
          >
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
