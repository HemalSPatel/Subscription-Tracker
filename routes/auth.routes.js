import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => {
  res.send({ title: "Sign Up" }); // this is the response that the API makes when this endpoint is called (need to implement custom logic later where you take into account different requests)
});

authRouter.post("/sign-in", (req, res) => {
  res.send({ title: "Sign In" });
});

authRouter.post("/sign-out", (req, res) => {
  res.send({ title: "Sign Out" });
});

export default authRouter;
