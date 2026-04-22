import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

const scanSound = new Audio("beep.mp3");
scanSound.load();

const barcodeDatabase = {
  "8909106035171": {
    title: "Surf excel Matic",
    price: 10,
    description: "Removes tough dried stains",
  },
  "8909102234554": {
    title: "Red tape corcs",
    price: 699,
    description: "Sandles for men",
  },
  "22491A4210": {
    title:
      "Choda subramanaym, AIML,B.tech 2022-2026 Batch Qis college of engineering and technology",
    price: null,
    description: "Student Profile Data",
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
              const isSpecial = decodedText === "22491A4210";

              // ✅ SPECIAL CASE: replace list with only profile data
              if (isSpecial) {
                return [
                  {
                    ...found,
                    code: decodedText,
                    quantity: 1,
                    isProfile: true,
                    price: 0, // avoid invoice calculation issues
                  },
                ];
              }

              const index = prevItems.findIndex(
                (item) => item.code === decodedText
              );

              if (index !== -1) {
                const newItems = [...prevItems];
                newItems[index].quantity += 1;
                return newItems;
              } else {
                return [
                  ...prevItems,
                  {
                    ...found,
                    code: decodedText,
                    quantity: 1,
                    isProfile: false,
                  },
                ];
              }
            });

            setErrorMsg("");
          } else {
            setErrorMsg(`Barcode ${decodedText} not found in database.`);
          }

          setTimeout(() => (lastScannedRef.current = null), 2000);
        }
      },
      () => {}
    );

    return () => scanner.clear().catch(console.error);
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 print:bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-3xl shadow-2xl border border-gray-300 print-area">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6 print-hidden">
          📷 Barcode Scanner
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Scanner */}
          <div className="flex-1 print-hidden">
            <div
              id="reader"
              className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-400 shadow-lg"
            />
          </div>

          {/* Invoice */}
          <div className="flex-1">

            {items.length > 0 ? (
              <>
                {/* PROFILE MODE (NO UI CHANGE — just inside invoice area) */}
                {items[0].isProfile ? (
                  <div className="p-4 bg-blue-50 border rounded-xl">
                    <h2 className="text-lg font-bold text-blue-800">
                      👤 User Details
                    </h2>

                    <p className="mt-2 font-semibold">
                      {items[0].title}
                    </p>

                    <p className="text-gray-600">
                      {items[0].description}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      ID: {items[0].code}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* YOUR ORIGINAL UI UNCHANGED BELOW */}

                    <div className="font-mono text-sm space-y-3">

                      <div className="text-center">
                        <h2 className="text-lg font-bold text-gray-800">
                          panda barcode scanner
                        </h2>
                        <p className="text-gray-600">
                          GSTIN: 29ABCDE1234F1Z5
                        </p>
                        <p className="text-gray-600">
                          support@panda.in
                        </p>
                        <hr className="my-2 border-t border-dashed border-gray-400" />
                      </div>

                      <div>
                        <p>
                          Invoice Date:{" "}
                          <strong>{new Date().toLocaleDateString()}</strong>
                        </p>
                        <p>
                          Invoice No:{" "}
                          <strong>
                            TS-{Math.floor(Math.random() * 90000 + 10000)}
                          </strong>
                        </p>
                        <p>Shipment Type: COD</p>
                        <p>
                          Total Items:{" "}
                          {items.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )}
                        </p>
                      </div>

                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-100 text-blue-800">
                            <th className="py-2 px-2 border-b">Item</th>
                            <th className="py-2 px-2 border-b">Qty</th>
                            <th className="py-2 px-2 border-b">Rate</th>
                            <th className="py-2 px-2 border-b">Total</th>
                          </tr>
                        </thead>

                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-2">{item.title}</td>
                              <td className="py-2 px-2">
                                {item.quantity}
                              </td>
                              <td className="py-2 px-2">
                                ₹{item.price}
                              </td>
                              <td className="py-2 px-2">
                                ₹{item.price * item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="text-right font-semibold">
                        Total Amount: ₹{totalAmount}
                      </div>

                      <div className="text-right">
                        <label className="text-sm mr-2">
                          Discount (%):
                        </label>
                        <input
                          type="number"
                          value={discountPercent}
                          onChange={(e) =>
                            setDiscountPercent(Number(e.target.value))
                          }
                          className="border px-2 py-1 w-20"
                        />
                      </div>

                      <div className="text-right font-bold text-green-700">
                        Final Amount: ₹{finalAmount.toFixed(2)}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center print-hidden">
                Scan a barcode to generate an invoice
              </p>
            )}

            {errorMsg && (
              <div className="p-4 mt-3 bg-red-100 text-red-800 rounded print-hidden">
                {errorMsg}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
