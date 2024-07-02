import asyncHandler from "express-async-handler";

export const home = asyncHandler(async (req, res) => {
  res.render("index");
});

export const signup = asyncHandler(async (req, res) => {
  res.render("signup");
});
