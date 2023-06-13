import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [msgHash, setMsgHash] = useState("");
  const [msgSign, setMsgSign] = useState("");


  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} address={publicKey} privateKey={privateKey}/>
    </div>
  );
}

export default App;
