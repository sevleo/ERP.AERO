import asyncHandler from "express-async-handler";

const home = asyncHandler(async (req, res) => {
  res.render("index");
});

const signup = asyncHandler(async (req, res) => {
  res.render("signup");
});

const navigation = {
  home,
  signup,
};

export default navigation;
