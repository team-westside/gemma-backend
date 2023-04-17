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

// get all static data by type
router.get("/user", async (req, res) => {
  try {
    const data = await DB.queryBeginsWith(
      UserName,
      "type",
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});
// add static data by type
router.post("/user", isAuthenticated, async (req, res) => {
  try {
    // const { type } = req.params;
    const id = crypto.randomBytes(4).toString("hex");
    const { provider, account } = req.body;
    const parsedProvider = parser(provider);
    console.log(parsedProvider);
    const params = {
      pk: UserName,
      sk: `user#${account}`,
      provider,
      account,
      created: Date.now(),
    };
    contractAddress = process.env.CONTRACT_ADDRESS;
    const contract = new ethers.Contract(contractAddress, abi, parsedProvider);
    console.log("contract created");
    const result = await contract.registerUser(account);
    console.log("Data added to Blockchain!!");
    await DB.put(params, process.env.TABLE_NAME);
    return res
      .status(201)
      .json({ message: `${type} Data Added Successfully!` });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get static data by type and id
router.get("/user/:account", async (req, res) => {
  try {
    const { account } = req.params;
    const data = await DB.get(
      UserName,
      `user#${account}`,
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// delete static data by type and id
router.delete(
  "/user/:account",

  isAuthenticated,
  async (req, res) => {
    try {
      const { account } = req.params;
      await DB.delete(UserName, `user#${account}`, process.env.TABLE_NAME);
      return res
        .status(204)
        .json({ message: `${type} Data Deleted Successfully!` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

module.exports = router;
