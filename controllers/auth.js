const User = require("../models/user-model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");

module.exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body.user;
	if (!email || !password) {
		return next(new AppError("please provide email and password", 400));
	}

	const user = await User.login(email, password);

	const token = tokenService.generateToken({ id: user._id, role: user.role });

	res.cookie("jwtToken", token, {
		maxAge: 2 * 24 * 60 * 60 * 1000,
		httpOnly: true
	});

	res.status(201).json({
		status: "success",
		message: "login successful",
		user
	});
});

module.exports.register = catchAsync(async (req, res) => {
	const { user } = req.body;

	const newUser = await userService.createUser(user);
	await User.login(user.email, user.password);

	const token = tokenService.generateToken({
		id: newUser._id,
		role: newUser.role
	});

	res.cookie("jwtToken", token, {
		maxAge: 2 * 24 * 60 * 60 * 1000,
		httpOnly: true
	});

	res.status(201).json({
		status: "success",
		message: "registered successfully",
		user: registeredUser
	});
});

module.exports.registerAdmin = catchAsync(async (req, res) => {
	const { user } = req.body;

	user.role = "admin";
	const admin = await userService.createUser(user);
	await User.login(user.email, user.password);

	const token = createToken(admin._id, admin.role);

	res.cookie("jwtToken", token, {
		maxAge: 2 * 24 * 60 * 60 * 1000,
		httpOnly: true
	});

	res.status(201).json({
		status: "success",
		message: "registered successfully",
		admin
	});
});

module.exports.logout = (req, res) => {
	res.clearCookie("jwtToken");

	res.status(200).json({
		status: "success",
		message: "logged out",
		user: null
	});
};
