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
    description: "Student / Profile Data",
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

            setItems((prev) => {
              // 👉 SPECIAL PROFILE CASE
              if (decodedText === "22491A4210") {
                return [
                  {
                    ...found,
                    code: decodedText,
                    isProfile: true,
                  },
                ];
              }

              const index = prev.findIndex((i) => i.code === decodedText);

              if (index !== -1) {
                const copy = [...prev];
                copy[index].quantity += 1;
                return copy;
              }

              return [
                ...prev,
                {
                  ...found,
                  code: decodedText,
                  quantity: 1,
                  isProfile: false,
                },
              ];
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

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-6">
          📷 Barcode Scanner
        </h1>

        <div className="flex gap-6">

          {/* Scanner */}
          <div className="flex-1">
            <div id="reader" className="border rounded-lg overflow-hidden" />
          </div>

          {/* Right Panel */}
          <div className="flex-1">

            {errorMsg && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
                {errorMsg}
              </div>
            )}

            {items.length === 0 ? (
              <p className="text-gray-500">Scan a barcode</p>
            ) : (
              <>
                {items.map((item, idx) => {
                  // ⭐ PROFILE VIEW
                  if (item.isProfile) {
                    return (
                      <div
                        key={idx}
                        className="p-5 bg-blue-50 border rounded-xl shadow"
                      >
                        <h2 className="text-xl font-bold text-blue-800">
                          👤 Profile Details
                        </h2>

                        <p className="mt-2 font-semibold text-gray-800">
                          {item.title}
                        </p>

                        <p className="text-gray-600 mt-1">
                          {item.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          ID: {item.code}
                        </p>
                      </div>
                    );
                  }

                  // ⭐ NORMAL PRODUCT ROW
                  return (
                    <div
                      key={idx}
                      className="border p-3 rounded mb-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
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
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            setItems((prev) =>
                              prev.map((i, iIdx) =>
                                iIdx === idx
                                  ? { ...i, quantity: i.quantity + 1 }
                                  : i
                              )
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}

                <hr className="my-3" />

                <p>Total: ₹{totalAmount}</p>

                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) =>
                    setDiscountPercent(Number(e.target.value))
                  }
                  className="border p-1 mt-2 w-20"
                />

                <p>Final: ₹{finalAmount.toFixed(2)}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
