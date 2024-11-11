import { Agent } from "../model/agents.model.js";

async function getAllAgents(req, res) {
  try {
    const agents = await Agent.all();

    return res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

export { getAllAgents };
