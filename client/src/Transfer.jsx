import { useState } from "react";
import server from "./server";
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const {secp256k1} = require("ethereum-cryptography/secp256k1");

// Make a simple message with sender:amount:recipient
// This message gets verified at the backend server 
// After verification, the sum operation is performed 
// NOTE: The server stores the public key of users only


function GetSign(msgHash, privateKey){

  const digiSign = secp256k1.sign(msgHash, privateKey);

  return digiSign;
}

function GetHash(from, to, amount){

  const msgString = from + to + toString(amount);

  const msgHash = keccak256(utf8ToBytes(msgString));

  console.log("Message Hash:" + toHex(msgHash));

  // For simplicity we are assuming that address contains 
  // the private key of the user 
  return msgHash;
}


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msgHash = GetHash(address, recipient, sendAmount);

    const msgSign = GetSign(msgHash, privateKey);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address, // contains the public key of the sender 
        amount: parseInt(sendAmount), 
        recipient, //contains the public key of the recipient 
        msgHash, // contains the hash msg 
        msgSign //contains the signatured transaction msg
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
