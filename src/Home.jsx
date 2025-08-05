import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

// Load sound once at module level
const scanSound = new Audio("beep.mp3");
scanSound.load();


  const barcodeDatabase = {
  "8905639296492": {
    title: "Technosports T-Shirt",
    price: 425,
    description: "Breathable cotton sportswear for summer collection.",
  },
  "8905639127604": {
    title: "polo t shirtBox",
    price: 525,
    description: "Free sample order from Technosports. No payment required.",
  },
    "219143198693481": {
    title: "polo t shirtBox",
    price: 525,
    description: "Free sample order from Technosports. No payment required.",
  },
  "8905631870560": {
    title: "Technosports Premium Bottle",
    price: 799,
    description: "Leak-proof, BPA-free sports bottle. Durable and lightweight.",
  },
  "9D3P0PA#ACJ": {
    title: "HP Energy Star Package",
    price: 54999,
    description: "HP Energy Star certified product, eco-friendly packaging.",
  },
  "101883388759": {
    title: "Technosports Kitchenware",
    price: 1299,
    description: "Premium quality kitchen utensil for daily cooking needs.",
  },
};


export default function Home() {
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const lastScannedRef = useRef(null);

  const upiDetails = {
    upiId: "8919348949@ybl",
    payeeName: "Technosports",
    currency: "INR",
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 450, height: 450 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    });

    scanner.render(
      (decodedText) => {
        if (decodedText !== lastScannedRef.current) {
          lastScannedRef.current = decodedText;

          const found = barcodeDatabase[decodedText];
          if (found) {
            scanSound.currentTime = 0;
            scanSound.play();

            setItems((prevItems) => {
              const index = prevItems.findIndex((item) => item.code === decodedText);
              if (index !== -1) {
                const newItems = [...prevItems];
                newItems[index].quantity += 1;
                return newItems;
              } else {
                return [...prevItems, { ...found, code: decodedText, quantity: 1 }];
              }
            });

            setErrorMsg("");
          } else {
            setErrorMsg(`Barcode ${decodedText} not found in database.`);
          }

          setTimeout(() => (lastScannedRef.current = null), 2000);
        }
      },
      () => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 print:bg-white animate-fade-in">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-2xl border border-gray-200 print-area transition-all">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 print-hidden tracking-wide animate-fade-down">
          📷 Technosports Barcode Scanner
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 print-hidden animate-zoom-in">
            <div
              id="reader"
              className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-300 shadow-lg"
            />
          </div>

          <div className="flex-1">
            {items.length > 0 ? (
              <>
                <div className="flex justify-end mb-4 print-hidden">
                  <button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-all"
                  >
                    🖨️ Print Invoice
                  </button>
                </div>

                <div className="font-mono text-sm text-gray-800 animate-fade-in">
                  <div className="text-center mb-3">
                    <h2 className="text-xl font-bold text-blue-900">Technosports</h2>
                    <p className="text-gray-600">GSTIN: 29ABCDE1234F1Z5</p>
                    <p className="text-gray-600">support@technosports.in</p>
                    <hr className="my-2 border-t border-dashed border-gray-400" />
                  </div>

                  <div className="mb-3 space-y-1">
                    <p>Invoice Date: <strong>{new Date().toLocaleDateString()}</strong></p>
                    <p>Invoice No: <strong>TS-{Math.floor(Math.random() * 90000 + 10000)}</strong></p>
                    <p>Shipment Type: COD</p>
                    <p>Total Items: {items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                  </div>

                  <table className="w-full text-left mb-3 border-t border-b border-gray-300">
                    <thead>
                      <tr className="text-gray-700">
                        <th className="py-1">Item</th>
                        <th className="py-1">Qty</th>
                        <th className="py-1">Rate</th>
                        <th className="py-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-1">{item.title}</td>
                          <td className="py-1 flex items-center gap-2">
                            <button
                              onClick={() => setItems(prev => prev.map((i, iIdx) => iIdx === idx && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i))}
                              className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs"
                            >−</button>
                            {item.quantity}
                            <button
                              onClick={() => setItems(prev => prev.map((i, iIdx) => iIdx === idx ? { ...i, quantity: i.quantity + 1 } : i))}
                              className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs"
                            >+</button>
                          </td>
                          <td className="py-1">₹{item.price}</td>
                          <td className="py-1">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right font-semibold">
                    Total: ₹{totalAmount}
                  </div>

                  <div className="text-right my-1">
                    <label className="mr-2 font-medium">Discount (%):</label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="border px-2 py-1 text-sm w-20 rounded focus:outline-none focus:ring"
                      min={0}
                      max={100}
                    />
                  </div>

                  <div className="text-right text-gray-600">
                    Discount Amount: ₹{discountAmount.toFixed(2)}
                  </div>

                  <div className="text-right text-green-700 text-lg font-bold">
                    Final Amount: ₹{finalAmount.toFixed(2)}
                  </div>

                  <div className="mt-4 text-center print-hidden animate-fade-in">
                    <h3 className="text-sm font-semibold mb-2">Pay via UPI</h3>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                        `upi://pay?pa=${upiDetails.upiId}&pn=${upiDetails.payeeName}&am=${finalAmount.toFixed(2)}&cu=${upiDetails.currency}&tn=Technosports Invoice`
                      )}&size=200x200&color=000000&bgcolor=E0F2FE`}
                      alt="UPI QR Code"
                      className="mx-auto rounded-xl shadow border-4 border-blue-100"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Scan to pay ₹{finalAmount.toFixed(2)} to {upiDetails.payeeName}
                    </p>
                  </div>

                  <div className="mt-4 text-center text-gray-500 text-[10px] border-t pt-2">
                    This is a computer-generated invoice. No signature required.
                  </div>
                </div>
              </>
            ) : errorMsg ? (
              <div className="p-4 rounded bg-red-100 text-red-800 text-center font-semibold print-hidden animate-pulse">
                {errorMsg}
              </div>
            ) : (
              <p className="text-gray-600 text-center print-hidden animate-fade-in">
                Scan a barcode to generate an invoice
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



