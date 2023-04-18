const Router = require("express").Router;
const router = Router();
const DB = require("../utils/db");
const crypto = require("crypto");
const TableName = process.env.TABLE_NAME;
const validateEndpoint = require("../middlewares/validateEndpoint");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const UserName = "gemma";
const { ethers } = require("ethers");
const abi = require("../jaAssusre.json");
const { parser } = require("flatted");

// get all categories
router.get("/transactions", async (req, res) => {
  try {
    const data = await DB.queryBeginsWith(
      UserName,
      "transaction",
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// add transaction

router.post("/transaction", isAuthenticated, async (req, res) => {
  try {
    const id = crypto.randomBytes(4).toString("hex");
    const { productId, transactionId, from, to, hex_value, hash } = req.body;
    if (!productId || !transactionId || !from || !to || !hash) {
      return res.status(400).json({ message: "Missing Parameters!!" });
    }
    const params = {
      pk: UserName,
      sk: `transaction#${id}`,
      productId,
      transactionId,
      from,
      to,
      id,
      hex_value,
      hash,
      created: Date.now(),
    };
    await DB.put(params, process.env.TABLE_NAME);
    const product = await DB.get(UserName, `product#${productId}`, TableName);

    const newProduct = {
      ...product,
      forSale: false,
      ownersList: [
        ...product.ownersList,
        { owner: from, price: product.productPrice },
      ],
      productOwnerAddress: from,
    };
    await DB.put(newProduct, TableName);
    return res.status(201).json({ message: "Transaction Added Successfully!" });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get all transactions of a user
router.get("/transactions/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const data = await DB.queryBeginsWith(
      UserName,
      "transaction",
      process.env.TABLE_NAME
    );
    const filteredData = data.filter(
      (item) =>
        String(item.from).toLowerCase() == String(address).toLowerCase() ||
        String(item.to).toLowerCase() == String(address).toLowerCase()
    );
    if (
      String(address).toLowerCase() ==
      String(process.env.OWNER_ADDRESS).toLowerCase()
    ) {
      return res.status(200).json(data);
    } else {
      return res.status(200).json(filteredData);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;

// https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=0x9d0a7161238e7ec3060cda2cf011657d22da10a0082283a4746d15a057638b6a&apikey=3DZFTR77Q56BK8G7VBKIX3G7H2JRQNR9S1

// https://api-sepolia.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=0x9d0a7161238e7ec3060cda2cf011657d22da10a0082283a4746d15a057638b6a&apikey=3DZFTR77Q56BK8G7VBKIX3G7H2JRQNR9S1

// https://api-sepolia.etherscan.io/api?module=account&action=txlistinternal&txhash=0x9d0a7161238e7ec3060cda2cf011657d22da10a0082283a4746d15a057638b6a&apikey=3DZFTR77Q56BK8G7VBKIX3G7H2JRQNR9S1
