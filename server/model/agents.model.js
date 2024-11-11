import { ObjectId } from "mongodb";
import { getDb } from "../db/db.js";
import Joi from "joi";
import bcrypt from "bcrypt";

const agentSchema = Joi.object({
  username: Joi.string().min(4),
  password: Joi.string().min(8),
});

class Agent {
  static async collection() {
    return await getDb().collection("agents");
  }

  static async all() {
    return await (await this.collection()).find({}).toArray();
  }

  static async create(data) {
    const { error, value } = agentSchema.validate(data);

    if (error) {
      console.error(error);
      return { message: "validation error", status: 400, error };
    }

    let agent = await this.findBy({ username: value.username });

    if (agent) {
      return {
        message: "agent with this username already exists",
        status: 409,
        error: new Error("conflict"),
      };
    }

    const salt = await bcrypt.genSalt();
    value.password = await bcrypt.hash(value.password, salt);

    await (await this.collection()).insertOne(value);

    return { message: "agent created successfully", status: 201, error };
  }

  static async findBy(obj) {
    return await (await this.collection()).findOne(obj);
  }

  static async delete(id) {
    return await (
      await this.collection()
    ).deleteOne({ _id: ObjectId.createFromHexString(id) });
  }
}

export { Agent };
