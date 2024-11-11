import {Agent}from"../model/agents.model.js"

async function isAgent(req, res, next) {
    const user = req.user;
  
    const check = await Agent.findBy({username:user.username})

    if (!check) {
        return res.status(403).json({ message: "forbidden" });
      }
  
    next();
  }
  
  export { isAgent };