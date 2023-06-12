import server from "./server";
const {secp256k1} = require("ethereum-cryptography/secp256k1");

function Wallet({ publicKey, setPublicKey, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    // DStore the private key given by user
    const privateKeyHere = evt.target.value;
    setPrivateKey(privateKeyHere);
    // use the private key to generate the public key
    const publicKeyHere = secp256k1.getPublicKey(privateKeyHere);
    setPublicKey(publicKeyHere);

    // get the balance associated with the given public key from the backend 
    if (publicKeyHere) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKeyHere}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Enter Private Key
        <input placeholder="Type your private key:" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Wallet Address={publicKey}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
