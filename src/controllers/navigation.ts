import asyncHandler from "express-async-handler";

const home = asyncHandler(async (req, res) => {
  console.log(req.headers);
  res.render("index", { user: "" });
});

const signup = asyncHandler(async (req, res) => {
  res.render("signup");
});

const info = asyncHandler(async (req, res) => {
  res.render("info");
});

const navigation = {
  home,
  signup,
  info,
};

export default navigation;
