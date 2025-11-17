import React, { useState } from "react";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = '8a7b1c17b32c47c7a38f6fcae3e36f2a7d2e0ef15ee081a65d15d76f1a2d9f88',
ENCRYPTION_IV = '0d65d1e3aa9f7d899eb0a3c192c84af0';
// API_KEY = 'PKbUpN2qIK',
// SECRET_KEY = 'ESQ6Mv9qBXDgVC7ZXc6M1jefAg0g9QaIGtiPmrma'

const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY); // Replace with actual key
const iv = CryptoJS.enc.Hex.parse(ENCRYPTION_IV);   // Replace with actual IV

// AES Encryption function
function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// AES Decryption function
function decrypt(ciphertext) {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function App() {
  const [pan, setPan] = useState("AACCY1118L");
  const [apiKey, setApiKey] = useState("XPw6TGBL2v");
  const [apiSecretKey, setApiSecretKey] = useState("1iHPzqJhzpOzgrDFElbGCEbzm6b9Sk7CgDgQNPNNZ");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pan) {
      alert("Please enter a PAN");
      return;
    }

    try {
      setLoading(true);
      setResponse(null);

      // Encrypt PAN
      console.log("pan =", pan)
      const encryptedPAN = encrypt(pan);
      console.log("encryptedPAN =", encryptedPAN)
      const safePAN = encodeURIComponent(encryptedPAN);
      console.log("safePAN =", safePAN)

      // Build URL
      // const url = `https://api.finanvo.in/pan/detailed-report/enc-info?pan=${safePAN}`;
      const url = `http://localhost:3000/pan/detailed-report/enc-info?pan=${safePAN}`;

      if(!apiKey || !apiSecretKey){
        alert("Please enter API Key and Secret Key");
        setLoading(false);
        return;
      }

      // API Call
      const res = await fetch(url, {
        headers: {
          "x-api-key": apiKey,
          "x-api-secret-key": apiSecretKey,
        },
      });

      const json = await res.json();

      if (json.data) {
        const decryptedResponse = decrypt(json.data);
        setResponse(JSON.parse(decryptedResponse));
      } else {
        setResponse(json);
      }
    } catch (error) {
      console.error(error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>🔐 Finanvo Encrypted PAN Report</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter PAN (e.g., 17USA29036)"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        <input
          type="text"
          placeholder="Enter api key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        <input
          type="text"
          placeholder="Enter api secret key"
          value={apiSecretKey}
          onChange={(e) => setApiSecretKey(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        {response && (
          <pre
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              maxWidth: "100%",
            }}
          >
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
