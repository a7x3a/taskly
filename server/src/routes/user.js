const { Router } = require("express");
const User = require("../database/schemas/User");
const { hashPassword, comparePassword } = require("../utils/encrypt");
const router = Router();

router.get("", (request, response) => {
  try {
    const user = request.session.user;
    if (user) {
      response.status(201).send({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(401).json(e);
  }
});

//implement the changes
router.put("/change", async (request, response) => {
  try {
    const { email, password, newPassword , username } = request.body;
    const userId = request.session.user._id;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    //check if the password is correct
    if (comparePassword(password, request.session.user.password)) {
      if (email) {
        // Check if the email already exists for another user
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
          return response.status(400).json({ error: "Email already exists" });
        }
        user.email = email;
      }

      // Check if the username already exists for another user
      if (username) {
        const existingUsernameUser = await User.findOne({ username });
        if (
          existingUsernameUser &&
          existingUsernameUser._id.toString() !== userId
        ) {
          return response
            .status(400)
            .json({ error: "Username already exists" });
        }
        user.username = username;
      }

      // Save the updated user object to the database
      await user.save();

      // Update the session data with the new information
      if (email) {
        request.session.user.email = email;
      }
      if (username) {
        request.session.user.username = username;
      }
      // Update the password if newPassword is provided
      if (newPassword) {
        user.password = hashPassword(newPassword); // Hash the new password before saving
      }
      // Save the updated session
      request.session.save();

      response.json({
        msg: "Account information updated successfully",
        user: request.session.user,
      });
    }else{
      response.status(400).json({error : "password incorrect"})
    }
  } catch (error) {
    console.error("Error updating user:", error);
    response
      .status(500)
      .json({ message: "Failed to update user information", error });
  }
});


module.exports = router;
