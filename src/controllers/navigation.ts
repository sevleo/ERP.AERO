import asyncHandler from "express-async-handler";

export const home = asyncHandler(async (req, res) => {
  res.render("index", { user: req.user });
});
