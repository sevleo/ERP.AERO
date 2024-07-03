import asyncHandler from "express-async-handler";
import { calculateLatency } from "../helpers/calculateLatency";

const info = asyncHandler(async (req: any, res: any) => {
  console.log("display data info");
  console.log(req.headers);
  if (req.user) {
    try {
      res.status(200).send({
        success: true,
        message: "Loaded Info Page",
        userId: req.user.id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  } else {
    console.log("not logged in");
  }
});

const latency = asyncHandler(async (req: any, res: any) => {
  console.log("display latency info");
  console.log(req.headers);
  const latency = calculateLatency();
  if (req.user) {
    try {
      res.status(200).send({
        success: true,
        message: "Loaded Latency Page",
        userId: req.user.id,
        latency: latency,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  } else {
    console.log("not logged in");
  }
});

const displayData = {
  info,
  latency,
};
export default displayData;
