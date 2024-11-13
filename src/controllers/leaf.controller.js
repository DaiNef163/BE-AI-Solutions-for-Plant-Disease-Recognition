const leaf = require("../models/leaf");

const viewNameLeaf = async (req, res) => {
  try {
    const result = await leaf.distinct("nameLeaf");
    res.json(result);
  } catch (error) {
    res.status(500).send("Error fetching result");
  }
};
const createLeaf = async (req, res) => {
  try {
    const { nameLeaf } = req.body;
    console.log(req.body);
    const checkLeaf = await leaf.findOne({ nameLeaf });
    if (checkLeaf) {
      throw new Error("Lá này đã có trong db");
    }
    let result = await leaf.create({ nameLeaf });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json("Lá này đã có trong db hoặc tên không hợp lệ");
  }
};
module.exports = { viewNameLeaf, createLeaf };
