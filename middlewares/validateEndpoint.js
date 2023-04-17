const validateEndpoint = async (req, res, next) => {
  try {
    const allowed_endpoints = ["static", "user"];
    console.log(req.url);
    const url = req.url.split("/")[2];
    if (!allowed_endpoints.includes(url)) {
      return res.json({ message: `${req.url} Not Found!!` });
    }
    next();
  } catch (err) {
    return res.json(err);
  }
};
module.exports = validateEndpoint;
