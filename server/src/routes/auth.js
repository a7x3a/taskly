const { Router } = require("express");
const { hashPassword, comparePassword } = require("../utils/encrypt");
const user = require("../database/schemas/User");
const otp_generator = require("otp-generator");
const { sendMail } = require("../utils/otp_sender");
const router = Router();

router.post("/login", async (request, response) => {
  if (request.session.user) return response.send("u already logged in!");
  const { email, password } = request.body;
  if (!email || !password) return response.sendStatus(400);
  const userDB = await user.findOne({ email });
  if (!userDB) return response.sendStatus(401);
  else {
    const isValid = comparePassword(password, userDB.password);
    if (isValid) {
      request.session.user = userDB;
      response.status(200).json({ user: request.session.user });
    } else {
      response.sendStatus(401);
    }
  }
});

router.post("/register", async (request, response) => {
  const { username, email } = request.body;
  const userDB = await user.findOne({ email });
  const usernameDB = await user.findOne({ username });

  if (usernameDB) {
    response
      .status(400)
      .json({ msg: "This username is already used by another account." });
    return;
  }

  if (userDB) {
    response
      .status(400)
      .json({ msg: "This email is already used by another account." });
    return;
  }

  const password = hashPassword(request.body.password);
  const newUser = await user.create({ username, password, email });
  newUser.save();
  const userCreated = await user.findOne({ email });
  request.session.user = userCreated;
  response.status(200).json({ user: request.session.user });
});

router.get("/check-token", async (request, response) => {
  try {
    // Check if user session exists
    if (request.session.user) {
      // Fetch user details from the database (example using Mongoose)
      const userDB = await user.findById(request.session.user._id);
      if (userDB) {
        // User authenticated, return user data
        return response.status(200).json({ user: userDB });
      }
    }
    // User session not found or user not authenticated
    return response.sendStatus(401);
  } catch (err) {
    console.error("Error checking token:", err);
    return response.sendStatus(500); // Internal server error
  }
});

router.post("/logout", (request, response) => {
  try {
    if (request.session.user) {
      request.session.destroy((e) => {
        if (e) {
          return response.status(500).json({ message: "Failed to logout" });
        } else {
          response.clearCookie("connect.sid");
          response.status(201).send({ msg: "Logged out successfully!" });
        }
      });
    } else {
      response.status(500).send({ msg: "u already logged out!" });
    }
  } catch (e) {
    response.send(e);
  }
});

router.post("/generate-otp", async (request, response) => {
  const otp = otp_generator.generate(5, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  //send it to the db user with the assigned email in the request
  try {
    const { email } = request.body;
    if (!email) return response.sendStatus(400);
    const userDB = await user.findOne({ email });
    if (!userDB) {
      response.status(404).json({
        msg: "No user found with this email address. Please check your email or sign up for a new account.",
      });
    } else {
      //Send The OTP via email to that assigned email
      const htmlContent = `
             <html>
               <body>
                 <h1>Your OTP for Taskly App</h1>
                 <p style="font-size: 24px;">${otp}</p>
                 <p>this code will be expired after 1h.</p>
               </body>
             </html>
            `;

      // Send email
      sendMail(email, "Taskly OTP Code.", htmlContent)
        .then(() => {
          console.log("Email sent successfully");
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
        });
      userDB.OTP = otp;
      userDB.OTP_EXP = Date.now() + 60 * 60 * 1000;
      userDB.save();
      response.status(201).json({ msg: "OTP Code Sent to your email!" });
    }
  } catch (e) {
    response.sendStatus(400).json({ msg: "Error" });
  }
});

router.put("/verify-otp", async (request, response) => {
  try {
    const { email, newPassword, otp } = request.body;
    // Find user by email
    const userDB = await user.findOne({ email });

    // If user not found
    if (!userDB) {
      return response.sendStatus(404);
    }
    // Verify OTP and expiry
    if (parseInt(otp) === userDB.OTP && Date.now() < userDB.OTP_EXP) {
      userDB.password = hashPassword(newPassword);
      await userDB.save();
      request.session.user = userDB;
      return response.status(200).json({ user: request.session.user });
    } else {
      return response.sendStatus(400);
    }
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
