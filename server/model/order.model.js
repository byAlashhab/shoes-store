import Joi from "joi";
import { getDb } from "../db/db.js";
import { dateWithDayMonthYear } from "../lib/utils.js";
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";
import { Shoes } from "./shoes.model.js";

const orderSchema = Joi.object({
  userId: Joi.string(),
  userName: Joi.string().min(6),
  userUserName: Joi.string().min(4),
  userPhoneNumber: Joi.string(),
  userAddress: Joi.string(),

  shoesName: Joi.string(),
  shoesImage: Joi.string(),
  orderedSize: Joi.string(),
  orderedAmount: Joi.string(),

  userOrderId: Joi.string().default(nanoid()),
  deliveryOrderId: Joi.string().default(nanoid()),

  createdAt: Joi.date().optional().default(dateWithDayMonthYear()),
  status: Joi.string().default("pending"),
});

class Order {
  static async collection() {
    return await getDb().collection("orders");
  }

  static async all() {
    return await (await this.collection()).find({}).toArray();
  }

  static async create(data) {
    const { error, value } = orderSchema.validate(data);

    if (error) {
      console.error(error);
      return { message: "validation error", status: 400, error };
    }

    //update shoes
    const shoes = await (
      await Shoes.collection()
    ).findOne({ title: value.shoesName });

    let index;

    shoes.sizes.split(" ").map((s, i) => {
      
      if ((value.orderedSize === s)) {
        index = i;
      }
      return s;
    });

    const newSize = shoes.availability
      .split(" ")
      .map((a, i) => {
        
        
        if (i === index) {
          a = a - value.orderedAmount;

          if (a < 0) {
            throw new Error("Error calculating the amounts");
          } else {
            return a;
          }
        } else {
          return a;
        }
      })
      .join(" ");

    await (
      await Shoes.collection()
    ).updateOne(
      { title: value.shoesName },
      { $set: { availability: newSize } }
    );

    await (await this.collection()).insertOne(value);

    return { message: "order created successfully", status: 201, error };
  }

  static async orderByUser(userId) {
    return await (await this.collection()).find({ userId }).toArray();
  }

  static async orderById(userId) {
    return await (
      await this.collection()
    ).findOne({ _id: ObjectId.createFromHexString(userId) });
  }

  static async analytics() {
    let orders = await this.all();

    const analyticsArray = [];

    for (let i = 0; i < orders.length; i++) {
      const obj = {
        date: orders[i].createdAt,
        orders: 1,
      };

      for (let j = i + 1; j < orders.length; j++) {
        if (orders[i].createdAt === orders[j].createdAt) {
          obj.orders++;
          orders = orders.filter((_, index) => index !== j);
        }
      }

      analyticsArray.push(obj);
    }

    return analyticsArray;
  }

  static async confirmOrder(id) {
    return await (
      await this.collection()
    ).updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: { status: "confirmed" } }
    );
  }

  static async delete(id) {
    return await (
      await this.collection()
    ).deleteOne({ _id: ObjectId.createFromHexString(id) });
  }

  static async verifyOrder(id) {
    return await (
      await this.collection()
    ).updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: { status: "delivered" } }
    );
  }
}

export { Order };
