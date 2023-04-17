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
    const { productId, transactionId, from, to } = req.body;
    if (!productId || !transactionId || !from || !to) {
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

module.exports = router;
