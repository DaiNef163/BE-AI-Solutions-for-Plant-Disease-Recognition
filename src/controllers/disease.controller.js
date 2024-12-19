const Disease = require(".././models/Disease");
const viewDisease = async (req, res) => {
  try {
    const disease = await Disease.find();
    res.json(disease)
  } catch (error) {
    console.log(error);
  }
};

module.exports = {viewDisease}