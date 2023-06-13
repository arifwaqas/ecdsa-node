const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {
  secp256k1,
  Signature,
  verify,
} = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  //privateKey: 70b5376e526314be5cf4729bef750a6eca4f41fc6d42800372a1cdfa2837d4b5
  "035764183c3b72b8a29796803fdf9171a9c39f0f599a92f3dcf39e8f56450b7fdf": 100,
  //privateKey: 6c26a87adc470ac16fe0bb3cf6bff1ac8192f374ace233f39b9b3ec2ea21f2bd
  "03ac97fccba6e70cf45e1e5deee785ac0ff7009075c66f1a5746bd1c180216e0a1": 100,
  //privateKey: 8aa57826425a01e5edef0174886ecbcbdb07e9445205339c98bd7ab25019e7bc
  "035c068e981a541ece920a3e1201f7456575e4039ec1b88680eb0c03dc3223cdd0": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  console.log("Server balance request for: " + address);
  console.log("Balance:" + balance);
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, transactionHash, r, s } = req.body;

  console.log("Received r from frontend:" + r);
  const signature = new Signature(BigInt(r), BigInt(s));

  console.log(signature);
  //get the public key of the sender from the transaction msg
  const isValid = verify(signature, transactionHash, sender);
  console.log(isValid);

  if (isValid) {
    // Operations of the funds transfered
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    console.log("ERROR 404 Manipulation found");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function isAuthorizedTransaction(msgHashToBeVerified, msgSign, sender) {
  const isSigned = secp256k1.verify(msgSign, msgHashToBeVerified, sender);
  console.log("isSigned: " + isSigned);
  return isSigned;
}
