const userModel = require("../models/user.model")
const tokenBlackListModel = require("../models/blacklist.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password
 * @access Public
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and password"
      })
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "Account already exists with this email address or username"
      })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
      username,
      email,
      password: hash
    })

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      message: "Error during registration",
      error: error.message
    })
  }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password 
 * @access Public
 */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      message: "Error during login",
      error: error.message
    })
  }
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (token) {
      await tokenBlackListModel.create({ token })
    }

    res.clearCookie("token")
    res.status(200).json({
      message: "User logged out successfully"
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      message: "Error during logout",
      error: error.message
    })
  }
}

/**
 * @name getMeController
 * @description fetch logged in user data
 * @access Private
 */
async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      message: "User data fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        targetTitle: user.targetTitle || "",
        phone: user.phone || "",
        location: user.location || "",
        linkedin: user.linkedin || "",
        github: user.github || ""
      }
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      message: "Error fetching user",
      error: error.message
    })
  }
}

/**
 * @name updateProfileController
 * @description update logged in user profile details
 * @access Private
 */
async function updateProfileController(req, res) {
  try {
    const { username, email, bio, targetTitle, phone, location, linkedin, github } = req.body

    const user = await userModel.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const trimmedUsername = username ? username.trim() : ""
    const trimmedEmail = email ? email.trim().toLowerCase() : ""

    if (trimmedUsername && trimmedUsername !== user.username) {
      const existingUsername = await userModel.findOne({ username: trimmedUsername, _id: { $ne: user._id } })
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" })
      }
      user.username = trimmedUsername
    }

    if (trimmedEmail && trimmedEmail !== user.email) {
      const existingEmail = await userModel.findOne({ email: trimmedEmail, _id: { $ne: user._id } })
      if (existingEmail) {
        return res.status(400).json({ message: "Email address already in use" })
      }
      user.email = trimmedEmail
    }

    if (bio !== undefined) user.bio = bio
    if (targetTitle !== undefined) user.targetTitle = targetTitle
    if (phone !== undefined) user.phone = phone
    if (location !== undefined) user.location = location
    if (linkedin !== undefined) user.linkedin = linkedin
    if (github !== undefined) user.github = github

    await user.save()

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })

    res.status(200).json({
      message: "Profile updated successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        targetTitle: user.targetTitle,
        phone: user.phone,
        location: user.location,
        linkedin: user.linkedin,
        github: user.github
      }
    })
  } catch (error) {
    console.error("Update profile error:", error)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field"
      return res.status(400).json({ message: `That ${field} is already in use by another account.` })
    }
    res.status(500).json({
      message: error.message || "Error updating profile",
      error: error.message
    })
  }
}

/**
 * @name updatePasswordController
 * @description update logged in user password
 * @access Private
 */
async function updatePasswordController(req, res) {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" })
    }

    const user = await userModel.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.status(200).json({
      message: "Password changed successfully"
    })
  } catch (error) {
    console.error("Update password error:", error)
    res.status(500).json({
      message: "Error updating password",
      error: error.message
    })
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateProfileController,
  updatePasswordController
}