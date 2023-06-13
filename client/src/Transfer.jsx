import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { bytesToHex, bytesToUtf8, utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
BigInt.prototype.toJSON = function() { return this.toString() }
// Make a simple message with sender:amount:recipient
// This message gets verified at the backend server 
// After verification, the sum operation is performed 
// NOTE: The server stores the public key of users only

// function to get the transaction hash
function getTransactionHash(transactionMsg){
  const transactionMsgInString = JSON.stringify(transactionMsg);
  return keccak256(utf8ToBytes(transactionMsgInString));
}

async function getTransactionSignature(transactionMsg, privateKey){
  return secp256k1.sign(transactionMsg, privateKey);
}

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {

      const transaction = {
        sender: address, //public key of the sender
        amount: parseInt(sendAmount),
        recipient
      }
      const msgHash = getTransactionHash(transaction);
      transaction.transactionHash = toHex(msgHash);
      console.log("privatekey:" + privateKey);
      const signature = await getTransactionSignature(transaction.transactionHash, privateKey)
      const r = signature.r.toString();
      const s = signature.s.toString();
      transaction.r = r;
      transaction.s = s;
      console.log("transaction.r:" + transaction.r)
      console.log("transaction.r.type:" + transaction.r.type)

      /*
      const isValid = secp256k1.verify(signature, transaction.transactionHash, transaction.sender);
      console.log(isValid)
      //transaction.recoveryBit = recoveryBit;
      */

      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    } finally {
      console.log("done");
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
