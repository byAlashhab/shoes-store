import { User } from "../model/user.model.js";

async function getAllUsers(req, res) {
  try {
    const users = await User.all();

    const editedUsers = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      };
    });

    return res.status(200).json(editedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function getUserByEmail(req, res) {
  const u = req.user;

  try {
    const user = await User.findBy({ email: u.email });

    return res
      .status(200)
      .json({ name: user.name, role: user.role, image: user.image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function updateUser(req, res) {
  const { name, image } = req.body;
  const user = req.user;

  if (!name || !image) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    await User.update(req.body, user);
    return res.status(200).json({ message: "profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

async function getAnalytics(req, res) {
  try {
    let analytics = await User.analytics();

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

export { getAllUsers, getUserByEmail, updateUser, getAnalytics };
