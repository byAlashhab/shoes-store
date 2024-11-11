import { Shoes, shoesShema } from "../model/shoes.model.js";

async function getAllShoes(req, res) {
  try {
    const shoes = await Shoes.all();

    return res.status(200).json(shoes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function insertShoes(req, res) {
  try {
    const response = await Shoes.create(req.body);

    return res.status(response.status).json({ message: response.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function getShoesById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    const shoes = await Shoes.getById(id);
    return res.status(200).json(shoes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function updateShoesById(req, res) {
  const { id } = req.params;
  const { error, value } = shoesShema.validate(req.body);

  if (!id || error) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    const { status, message } = await Shoes.update(id, value);
    return res.status(status).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function deleteShoes(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    await Shoes.delete(id);

    return res.status(200).json({ message: "shoes deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

export { getAllShoes, insertShoes, getShoesById, deleteShoes, updateShoesById };
