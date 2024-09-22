const delay = (req, res, next) => {
  setTimeout(() => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

    }

    next();
  }, 10000);
};

module.exports = delay;
