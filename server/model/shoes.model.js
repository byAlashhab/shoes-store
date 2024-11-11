import Joi from "joi";
import { getDb } from "../db/db.js";
import { ObjectId } from "mongodb";

export const shoesShema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.string(),
  sizes: Joi.string(),
  availability: Joi.string(),
  image: Joi.string(),
  type: Joi.string(),
});

class Shoes {
  static async collection() {
    return await getDb().collection("shoes");
  }

  static async all() {
    return await (await this.collection()).find({}).toArray();
  }

  static async create(data) {
    const { error, value } = shoesShema.validate(data);

    if (error) {
      console.error(error);
      return { message: "missing data", status: 400 };
    }

    const shoes = await (
      await this.collection()
    ).findOne({ title: value.title });

    if (shoes) {
      return { message: "title must be unique", status: 409 };
    }

    await (await this.collection()).insertOne(value);

    return { message: "shoes created successfully", status: 201 };
  }

  static async getById(id) {
    return await (
      await this.collection()
    ).findOne({ _id: ObjectId.createFromHexString(id) });
  }

  static async update(id, data) {
    const shoes = await (
      await this.collection()
    ).findOne({ title: data.title });

    const oldShoes = await this.getById(id);

    if (shoes && shoes.title !== oldShoes.title) {
      return { message: "title must be unique", status: 409 };
    }

    await (
      await this.collection()
    ).updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: data });

    return { message: "shoes updated successfully", status: 200 };
  }

  static async delete(id) {
    return await (
      await this.collection()
    ).deleteOne({ _id: ObjectId.createFromHexString(id) });
  }
}

export { Shoes };
