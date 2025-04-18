import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

//api/v1/users/...
// TODO: make this route only accessable for admin users
userRouter.get("/", getUsers);

// uses the authorize middleware to protect this route so that only the currently logged in user can access their own data via bearer token
userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => {
  res.send({ title: "POST a user" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE a user" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE a user" });
});

export default userRouter;
