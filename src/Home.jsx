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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 print:bg-white">
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-2xl shadow-xl border border-gray-200 print-area">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4 print-hidden">
          📷 Technosports Barcode Scanner
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Scanner Section */}
          <div className="flex-1 print-hidden">
            <div
              id="reader"
              className="w-full aspect-square rounded-xl overflow-hidden border border-gray-300 shadow-md"
            />
          </div>

          {/* Invoice Section */}
          <div className="flex-1">
            {items.length > 0 ? (
              <>
                <div className="flex justify-end mb-4 print-hidden">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    🖨️ Print Invoice
                  </button>
                </div>

                <div className="font-mono text-xs">
                  <div className="text-center mb-2">
                    <h2 className="text-base font-bold">Technosports</h2>
                    <p className="text-gray-700">GSTIN: 29ABCDE1234F1Z5</p>
                    <p className="text-gray-700">support@technosports.in</p>
                    <hr className="my-1 border-t border-dashed border-gray-400" />
                  </div>

                  <div className="mb-2">
                    <p>
                      Invoice Date: <strong>{new Date().toLocaleDateString()}</strong>
                    </p>
                    <p>
                      Invoice No: <strong>TS-{Math.floor(Math.random() * 90000 + 10000)}</strong>
                    </p>
                    <p>Shipment Type: COD</p>
                    <p>
                      Total Items: {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </p>
                  </div>

                  <table className="w-full text-left mb-2">
                    <thead>
                      <tr>
                        <th className="py-1 border-b border-gray-400">Item</th>
                        <th className="py-1 border-b border-gray-400">Qty</th>
                        <th className="py-1 border-b border-gray-400">Rate</th>
                        <th className="py-1 border-b border-gray-400">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="no-page-break">
                          <td className="py-1">{item.title}</td>
                          <td className="py-1 flex items-center gap-2">
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i, iIdx) =>
                                    iIdx === idx && i.quantity > 1
                                      ? { ...i, quantity: i.quantity - 1 }
                                      : i
                                  )
                                )
                              }
                              className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs"
                            >
                              −
                            </button>
                            {item.quantity}
                            <button
                              onClick={() =>
                                setItems((prev) =>
                                  prev.map((i, iIdx) =>
                                    iIdx === idx ? { ...i, quantity: i.quantity + 1 } : i
                                  )
                                )
                              }
                              className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs"
                            >
                              +
                            </button>
                          </td>
                          <td className="py-1">₹{item.price}</td>
                          <td className="py-1">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right font-semibold mb-1">
                    Total Amount: ₹{totalAmount}
                  </div>

                  {/* Discount percentage input */}
                  <div className="text-right mb-1">
                    <label className="text-sm font-medium mr-2">Discount (%):</label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="border px-2 py-1 text-xs w-20 rounded"
                      min={0}
                      max={100}
                    />
                  </div>

                  <div className="text-right font-semibold text-sm mb-1 text-gray-600">
                    Discount Amount: ₹{discountAmount.toFixed(2)}
                  </div>

                  <div className="text-right font-bold text-green-700 text-sm mb-4">
                    Final Amount: ₹{finalAmount.toFixed(2)}
                  </div>

                  {/* UPI QR Code */}
                  <div className="mt-4 text-center print-hidden">
                    <h3 className="text-sm font-semibold mb-1">Pay via UPI</h3>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                        `upi://pay?pa=${upiDetails.upiId}&pn=${upiDetails.payeeName}&am=${finalAmount.toFixed(
                          2
                        )}&cu=${upiDetails.currency}&tn=Technosports Invoice`
                      )}&size=200x200&color=000000&bgcolor=E0F2FE`}
                      alt="UPI QR Code"
                      className="mx-auto rounded-xl shadow-md border-4 border-blue-100"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Scan to pay ₹{finalAmount.toFixed(2)} to {upiDetails.payeeName}
                    </p>
                  </div>

                  <div className="mt-4 text-center text-gray-600 text-[10px] border-t pt-2">
                    This is a computer-generated invoice.
                    <br />
                    No signature required.
                  </div>
                </div>
              </>
            ) : errorMsg ? (
              <div className="p-4 rounded bg-red-100 text-red-800 text-center font-semibold print-hidden">
                {errorMsg}
              </div>
            ) : (
              <p className="text-gray-500 text-center print-hidden">
                Scan a barcode to generate an invoice
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

