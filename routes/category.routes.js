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
router.get("/category", async (req, res) => {
  try {
    const data = await DB.queryBeginsWith(
      UserName,
      "category",
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// add category

router.post("/category", isAuthenticated, async (req, res) => {
  try {
    const id = crypto.randomBytes(4).toString("hex");
    const { categoryName, description, image } = req.body;
    if (!categoryName || !description || !image) {
      return res.status(400).json({ message: "Missing Parameters!!" });
    }
    const params = {
      pk: UserName,
      sk: `category#${id}`,
      categoryName,
      description,
      image,
      id,
      created: Date.now(),
    };
    await DB.put(params, process.env.TABLE_NAME);
    return res.status(201).json({ message: "Category Added Successfully!" });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get category by id
router.get("/category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await DB.get(UserName, `category#${id}`, TableName);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// update category by id

router.put("/category/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description, image } = req.body;
    if (!categoryName || !description || !image) {
      return res.status(400).json({ message: "Missing Parameters!!" });
    }
    const params = {
      pk: UserName,
      sk: `category#${id}`,
      categoryName,
      description,
      image,
      id,
      created: Date.now(),
    };
    await DB.put(params, process.env.TABLE_NAME);
    return res.status(201).json({ message: "Category Updated Successfully!" });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// delete category by id

router.delete("/category/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await DB.delete(UserName, `category#${id}`, TableName);
    return res.status(200).json({ message: "Category Deleted Successfully!" });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get all products by category id

router.get("/category/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await DB.queryBeginsWith(UserName, `product#`, TableName);
    const products = data.filter(
      (item) => item.categoryId === id && item.forSale == true
    );
    return res.status(200).json(products);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// batch add categories

router.post("/category/batch", isAuthenticated, async (req, res) => {
  try {
    const { categories } = req.body;
    if (!categories) {
      return res.status(400).json({ message: "Missing Parameters!!" });
    }
    console.log(categories);
    const params = categories.map((item) => {
      const id = crypto.randomBytes(4).toString("hex");
      const created = Date.now().toLocaleString();
      return {
        pk: UserName,
        sk: `category#${id}`,
        categoryName: item.categoryName,
        description: item.description,
        id,
        created: created,
      };
    });
    console.log(params);
    await DB.batchWrite(params, TableName);
    return res.status(201).json({ message: "Categories Added Successfully!" });
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;
