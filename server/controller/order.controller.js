import { Order } from "../model/order.model.js";
import { Shoes } from "../model/shoes.model.js";

async function getAllOrders(req, res) {
  try {
    const orders = await Order.all();

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function getUserOrders(req, res) {
  const { _id } = req.user;

  try {
    const orders = await Order.orderByUser(_id);

    const alteredOrders = orders.map((order) => {
      const { deliveryOrderId, ...rest } = order;

      return rest;
    });

    return res.status(200).json(alteredOrders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

async function createNewOrder(req, res) {
  try {
    const { status, message } = await Order.create({
      userId: req.user._id.toString(),
      userUserName: req.user.username,
      ...req.body,
    });

    return res.status(status).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function getAnalytics(req, res) {
  try {
    let analytics = await Order.analytics();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    analytics = analytics.filter((day) => {
      return new Date(day.date) >= sevenDaysAgo;
    });

    return res.status(200).json(analytics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function deleteOrder(req, res) {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const order = await Order.orderById(id);

    if (order.userId !== userId) {
      return res.status(403).json({ message: "not allowed" });
    }

    const shoes = await (
      await Shoes.collection()
    ).findOne({
      title: order.shoesName,
    });

    let index;

    shoes.sizes.split(" ").map((s, i) => {
      if (order.orderedSize === s) {
        index = i;
      }
      return s;
    });

    const newSize = shoes.availability
      .split(" ")
      .map((a, i) => {
        if (i === index) {
          return `${parseInt(a) + parseInt(order.orderedAmount)}`;
        } else {
          return a;
        }
      })
      .join(" ");

    await (
      await Shoes.collection()
    ).updateOne(
      { title: order.shoesName },
      { $set: { availability: newSize } }
    );

    await Order.delete(id);

    return res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function confirmOrder(req, res) {
  const userId = req.user._id;
  const { id } = req.params;

  const order = await Order.orderById(id);

  if (order.userId !== userId) {
    return res.status(403).json({ message: "not allowed" });
  }

  try {
    await Order.confirmOrder(id);
    return res.status(200).json({ message: "order confirm" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function verifyOrder(req, res) {
  const { userOrderId, deliveryOrderId } = req.body;

  if (!userOrderId || !deliveryOrderId) {
    return res.status(403).json({ message: "not allowed" });
  }

  try {
    const order = await (
      await Order.collection()
    ).findOne({ userOrderId, deliveryOrderId });

    if (!order) {
      return res.status(404).json({ message: "no order" });
    }

    await Order.verifyOrder(order._id.toString());

    return res.status(200).json({ message: "order verified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

export {
  getAllOrders,
  getUserOrders,
  getAnalytics,
  createNewOrder,
  deleteOrder,
  confirmOrder,
  verifyOrder,
};
