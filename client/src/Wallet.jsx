import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import { bytesToHex, utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";

function Wallet({ publicKey, setPublicKey, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    // Store the private key given by user
    const privateKeyHere = evt.target.value;
    //private key is stored in hex 
    setPrivateKey(privateKeyHere);
    console.log("private key set: "+ privateKeyHere);
    // use the private key to generate the public key
    if(privateKeyHere !== ""){
      const publicKeyHere = secp256k1.getPublicKey(privateKeyHere);
      const publicKeyString = bytesToHex(publicKeyHere)
      setPublicKey(publicKeyString);
      console.log("public key set: "+ publicKey);
      // get the balance associated with the given public key from the backend 
      if (publicKey) {
        const {
          data: { balance },
        } = await server.get(`balance/${publicKey}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }else {
      console.log("Field empty")
    }
   
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Enter Private Key
        <input placeholder="Type your private key:" value={privateKey} onChange={onChange}></input>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
