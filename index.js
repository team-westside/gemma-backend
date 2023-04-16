("use strict");
const express = require("express");
const app = express();
const cors = require("cors");
// const songRoutes = require("./routes/songs.routes");
// const notificationRoutes = require("./routes/notifications.routes");
// const staticRoutes = require("./routes/static.routes");
// const blogRoutes = require("./routes/blogs.routes");
// const staticAyushRoutes = require("./routes-ayush/static.routes");
// const blogAyushRoutes = require("./routes-ayush/blogs.routes");
// const { hash, verifyHash } = require("./utils/index");

app.use(cors());
require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// app.use("/api/v1", staticRoutes);
// app.use("/api/v1/songs", songRoutes.router);
// app.use("/api/v1/notifications", notificationRoutes.router);
// app.use("/api/v1/blogs", blogRoutes.router);

// app.use("/api/v1/ayush", staticAyushRoutes);
// app.use("/api/v1/ayush/blogs", blogAyushRoutes.router);
// app.use("/api/v1/ayush/songs", songRoutes.router);
// app.use("/api/v1/ayush/notifications", notificationRoutes.router);

app.get("/", (req, res) => {
  res.json({ Message: "Welcome to the Gemma API" });
});

// app.get("/hash", async (req, res) => {
//   // const password = "password";
//   const token = process.env.TOKEN;
//   const hashedToken = await hash(token);
//   const verify = await verifyHash(token, hashedToken);
//   res.json({ token, hashedToken, verify });
//   // res.send(hashedPassword, verify);
// });

app.listen(PORT, () => {
  // connectDB();
  //   console.log("DB Connected");
  console.log(`Backend listening on port ${PORT}!`);
});

module.exports = app;
// module.exports.handler = serverless(app);
