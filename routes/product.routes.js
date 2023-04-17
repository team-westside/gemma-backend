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
router.get("/product", async (req, res) => {
  try {
    // const { type } = req.params;
    const data = await DB.queryBeginsWith(
      UserName,
      "product",
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});
// add static data by type
router.post("/product", isAuthenticated, async (req, res) => {
  try {
    // const { type } = req.params;
    const id = crypto.randomBytes(4).toString("hex");
    const {
      categoryId,
      productName,
      productDescription,
      productPrice,
      productImages,
      categoryName,
    } = req.body;

    if (
      !categoryId ||
      !productName ||
      !productDescription ||
      !productPrice ||
      !productImages ||
      !categoryName
    ) {
      return res.status(400).json({ message: "Missing Parameters!!" });
    }
    const productOwnerAddress = process.env.OWNER_ADDRESS;
    const params = {
      pk: UserName,
      sk: `product#${id}`,
      categoryId,
      productName,
      productDescription,
      productPrice,
      productImages,
      productOwnerAddress,
      categoryName,
      id,
      productOwner: process.env.OWNER_ADDRESS,
      forSale: true,
      created: Date.now(),
    };

    await DB.put(params, process.env.TABLE_NAME);
    return res
      .status(201)
      .json({ message: `Product Data Added Successfully!` });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get static data by type and id
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await DB.get(
      UserName,
      `product#${id}`,
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// delete static data by type and id
router.delete(
  "/product/:id",

  isAuthenticated,
  async (req, res) => {
    try {
      const { id } = req.params;
      await DB.delete(UserName, `product#${id}`, process.env.TABLE_NAME);
      return res
        .status(204)
        .json({ message: `Product Data Deleted Successfully!` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put("/product/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await DB.get(
      UserName,
      `product#${id}`,
      process.env.TABLE_NAME
    );
    const params = {
      ...product,
      ...req.body,
      id,
      pk: UserName,
      sk: `product#${id}`,
    };
    await DB.put(params, process.env.TABLE_NAME);
    return res
      .status(200)
      .json({ message: `Product Data Updated Successfully!` });
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/products/available", async (req, res) => {
  try {
    const data = await DB.queryBeginsWith(
      UserName,
      "product",
      process.env.TABLE_NAME
    );
    // const availableProducts = data.filter(
    //   (product) => product.productOwnerAddress == process.env.OWNER_ADDRESS
    // );
    const availableProducts = data.filter((product) => product.forSale == true);
    //
    console.log(data);
    console.log(availableProducts);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/product/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await DB.queryBeginsWith(
      UserName,
      `product#`,
      process.env.TABLE_NAME
    );
    const availableProducts = data.filter(
      (product) => product.productOwnerAddress == id
    );
    return res.status(200).json(availableProducts);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// batchAdd products
router.post("/product/batch", isAuthenticated, async (req, res) => {
  try {
    const { products } = req.body;
    const params = products.map((product) => {
      const id = crypto.randomBytes(4).toString("hex");
      return {
        PutRequest: {
          Item: {
            pk: "product",
            sk: `product#${id}`,
            categoryId: product.categoryId,
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice,
            productImage: product.productImages,
            productOwnerAddress: process.env.OWNER_ADDRESS,
            categoryName: product.categoryName,
            id,
            created: Date.now(),
          },
        },
      };
    });
    await DB.batchWrite(params, process.env.TABLE_NAME);
    return res.status(201).json({ message: `Products Added Successfully!` });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get product by owner
router.get("/product/owner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await DB.queryBeginsWith(
      UserName,
      `product#`,
      process.env.TABLE_NAME
    );
    const availableProducts = data.filter(
      (product) => product.productOwnerAddress == id
    );
    return res.status(200).json(availableProducts);
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;
