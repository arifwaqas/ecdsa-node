const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { bytesToHex, utf8ToBytes } = require("ethereum-cryptography/utils");

for (let n = 0; n < 3; n++) {
  const privateKey = secp256k1.utils.randomPrivateKey();

  console.log("privateKey " + toString(n) + ":" + bytesToHex(privateKey));

  const publicKey = secp256k1.getPublicKey(privateKey);

  console.log("publicKey " + toString(n) + ":" + bytesToHex(publicKey));
}
