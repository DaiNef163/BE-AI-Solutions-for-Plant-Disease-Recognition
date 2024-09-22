const getHomepage = async (req, res) => {
  return res.status(200).json("hello world api 1 ");
};

module.exports = {
  getHomepage,
};
