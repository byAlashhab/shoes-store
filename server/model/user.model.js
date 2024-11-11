import Joi from "joi";
import { getDb } from "../db/db.js";
import bcrypt from "bcrypt";
import { dateWithDayMonthYear } from "../lib/utils.js";

const userSchema = Joi.object({
  name: Joi.string().min(1),
  email: Joi.string().email().required(),
  username: Joi.string().min(4),
  password: Joi.string().min(6),
  image: Joi.string().required(),
  createdAt: Joi.date().optional().default(dateWithDayMonthYear()),
  role: Joi.date().optional().default("user"),
});

class User {
  static async collection() {
    return await getDb().collection("users");
  }

  static async all() {
    return await (await this.collection()).find({}).toArray();
  }

  static async create(data) {
    const { value, error } = userSchema.validate(data);

    if (error) {
      console.error(error);
      return { message: "validation error", status: 400, error };
    }

    let user = await this.findBy({ email: value.email });

    if (user) {
      return {
        message: "user with this email already exists",
        status: 409,
        error: new Error("conflict"),
      };
    }

    user = await this.findBy({username: value.username});

    if (user) {
      return {
        message: "user with this username already exists",
        status: 409,
        error: new Error("conflict"),
      };
    }

    const salt = await bcrypt.genSalt();
    value.password = await bcrypt.hash(value.password, salt);

    await (await this.collection()).insertOne(value);

    return { message: "user created successfully", status: 201, error };
  }

  static async update({ name, image }, user) {
    const { email } = user;
    return await (
      await this.collection()
    ).updateOne({ email }, { $set: { name, image } });
  }

  static async findBy(obj) {
    return await (await this.collection()).findOne(obj);
  }

  static async deleteByEmail(email) {
    return await (await this.collection()).deleteOne({ email });
  }

  static async analytics() {
    let users = await this.all();

    const analyticsArray = [];

    for (let i = 0; i < users.length; i++) {
      const obj = {
        date: users[i].createdAt,
        users: 1,
      };

      for (let j = i + 1; j < users.length; j++) {
        if (users[i].createdAt === users[j].createdAt) {
          obj.users++;
          users = users.filter((_, index) => index !== j);
        }
      }

      analyticsArray.push(obj);
    }

    return analyticsArray;
  }
}

export { User };
