import React, { useState } from "react";

// 🔥 Your Product Database (Model Number Based)
const productDatabase = {
  "OR71/6": {
    title: "Technosports T-Shirt",
    price: 499,
  },
  "OR37/8": {
    title: "Sports Bottle",
    price: 799,
  },
  "TS1001": {
    title: "Running Shoes",
    price: 1999,
  },
  "TS2002": {
    title: "Gym Bag",
    price: 1499,
  },
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [modelInput, setModelInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // 🔥 Handle model number input
  const handleAddProduct = () => {
    const code = modelInput.trim();

    if (!code) return;

    const found = productDatabase[code];

    if (found) {
      setItems((prev) => {
        const index = prev.findIndex((item) => item.code === code);

        if (index !== -1) {
          const updated = [...prev];
          updated[index].quantity += 1;
          return updated;
        } else {
          return [...prev, { ...found, code, quantity: 1 }];
        }
      });

      setErrorMsg("");
      setModelInput("");
    } else {
      setErrorMsg(`Model ${code} not found`);
    }
  };

  // 💰 Calculations
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = totalAmount - discountAmount;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-4">
          🧾 Model Number Billing System
        </h1>

        {/* 🔤 Input Section */}
        <div className="flex gap-2 mb-4">
          <input
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            placeholder="Enter model number (e.g. oR71/6)"
            className="flex-1 border px-3 py-2 rounded"
            onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
          />
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* ❌ Error */}
        {errorMsg && (
          <p className="text-red-600 mb-3">{errorMsg}</p>
        )}

        {/* 🧾 Invoice */}
        {items.length > 0 ? (
          <>
            <table className="w-full text-sm mb-4 border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Item</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="text-center border-t">
                    <td className="p-2">{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">Total: ₹{totalAmount}</div>

            <div className="text-right mt-2">
              Discount (%):
              <input
                type="number"
                value={discountPercent}
                onChange={(e) =>
                  setDiscountPercent(Number(e.target.value))
                }
                className="border ml-2 w-16"
              />
            </div>

            <div className="text-right">
              Discount: ₹{discountAmount.toFixed(2)}
            </div>

            <div className="text-right font-bold text-green-600 text-lg">
              Final: ₹{finalAmount.toFixed(2)}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">
            Enter a model number to start billing
          </p>
        )}
      </div>
    </div>
  );
}
