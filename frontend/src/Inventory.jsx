import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import director from './controller';
const InventoryPage = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [direction, setDirection] = useState(null);
  const [formData, setFormData] = useState({ product: '', class: '', price: '', quantity: '' });

  useEffect(() => {
    fetch("http://localhost:5000/inventory", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        
        setDirection(data)
        if (!data.failure) {
          setInventory(data.response);
        } else {
          console.warn(data.message);
        }
      })
      .catch(err => console.error("Error fetching inventory:", err));
  }, []);

  const totalCost = inventory.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const handleRowClick = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const openForm = (mode) => {
    setFormMode(mode);
    if (mode === 'edit' && selectedIndex !== null) {
      setFormData(inventory[selectedIndex]);
    } else {
      setFormData({ product: '', class: '', price: '', quantity: '' });
    }
  };

const handleConfirm = async () => {
  const updated = [...inventory];

  try {
    if (formMode === 'add') {
      const response = await fetch("http://localhost:5000/inventory/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.failure) {
        updated.push({ ...formData, price: +formData.price, quantity: +formData.quantity });
      } else {
        return alert(data.message);
      }

    } else if (formMode === 'edit' && selectedIndex !== null) {
      const itemToUpdate = inventory[selectedIndex];
      const response = await fetch(`http://localhost:5000/inventory/edit/${itemToUpdate.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.failure) {
        updated[selectedIndex] = { ...formData, price: +formData.price, quantity: +formData.quantity };
      } else {
        return alert(data.message);
      }

    } else if (formMode === 'delete' && selectedIndex !== null) {
      const itemToDelete = inventory[selectedIndex];
      const response = await fetch(`http://localhost:5000/inventory/delete/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!data.failure) {
        updated.splice(selectedIndex, 1);
        setSelectedIndex(null);
      } else {
        return alert(data.message);
      }
    }

    setInventory(updated);
    setFormMode(null);
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong with the request.");
  }
};

  return director(direction) ?? (
    <div className="min-h-screen bg-[#EAEFEF] p-4 text-[#333446]">
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full text-sm text-center">
          <thead className="bg-[#333446] text-[#EAEFEF]">
            <tr>
              <th className="p-3">Products</th>
              <th className="p-3">Class</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(index)}
                className={`cursor-pointer transition-all ${
                  selectedIndex === index
                    ? 'bg-[#7F8CAA] text-white'
                    : 'hover:bg-[#B8CFCE]'
                }`}
              >
                <td className="p-2">{item.product}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">Rs.{item.price}</td>
                <td className="p-2">{item.quantity}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm space-y-1">
        <div>Total Inventory Cost: <strong>Rs.{totalCost}</strong></div>
        <div>Total Quantity: <strong>{totalQty}x</strong></div>
        <div>Selected Item: <strong>{selectedIndex !== null ? inventory[selectedIndex].product : 'None'}</strong></div>
      </div>

      <div className="mt-6 flex flex-col gap-3 items-center">
        <button onClick={() => navigate('/')} className="w-3/4 bg-[#7F8CAA] text-white py-2 rounded-full font-semibold shadow hover:bg-[#6c7b99]">← Go Back</button>
        <button onClick={() => openForm('add')} className="w-3/4 bg-[#333446] text-[#EAEFEF] py-2 rounded-lg shadow-md font-bold hover:bg-[#2b2c3a]">Add</button>
        <button onClick={() => selectedIndex !== null && openForm('edit')} className="w-3/4 bg-[#333446] text-[#EAEFEF] py-2 rounded-lg shadow-md font-bold hover:bg-[#2b2c3a]">Edit</button>
        <button onClick={() => selectedIndex !== null && openForm('delete')} className="w-3/4 bg-[#7F8CAA] text-white py-2 rounded-lg shadow-md font-bold hover:bg-[#6c7b99]">Delete</button>
      </div>

      {formMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#333446]/30">
          <div className="bg-[#EAEFEF] rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            {formMode === 'delete' ? (
              <>
                <h2 className="text-lg font-bold mb-4 text-[#333446]">
                  Remove <span className="text-[#7F8CAA]">{inventory[selectedIndex].product}</span> from the inventory?
                </h2>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setFormMode(null)} className="px-4 py-2 bg-[#B8CFCE] text-[#333446] rounded">Cancel</button>
                  <button onClick={handleConfirm} className="px-4 py-2 bg-[#7F8CAA] text-white rounded">Confirm</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4 text-[#333446]">
                  {formMode === 'add' ? 'Add New Item' : 'Edit Item'}
                </h2>
                <div className="space-y-3">
                  {["product", "class", "price", "quantity"].map((field) => (
                    <input
                      key={field}
                      type={field === "price" || field === "quantity" ? "number" : "text"}
                      placeholder={field[0].toUpperCase() + field.slice(1)}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full border border-[#7F8CAA] p-2 rounded bg-white text-[#333446]"
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setFormMode(null)} className="px-4 py-2 bg-[#B8CFCE] text-[#333446] rounded">Cancel</button>
                  <button onClick={handleConfirm} className="px-4 py-2 bg-[#7F8CAA] text-white rounded">Confirm</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )

};

export default InventoryPage;
