import supabase from "../config/db.js";
import { validatePassword } from "../util/password.validator.js";
import { setTokens } from "../util/setToken.js";

export const Signup = async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    if (!phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const { data: userPhone } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (userPhone) {
      return res.status(400).json({ message: "Phone number already in use." });
    }

    if (!email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const { data: userEmail, error: emailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (emailError.code === "22P02") {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (userEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    if (!password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      return res.status(500).json({ message: signupError.message });
    }

    const userId = authData.user?.id;

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        phone,
        email,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return res.status(500).json({
        message: "Failed to create user profile.",
        error: insertError.message || insertError.details,
      });
    }

    return res.status(200).json({
      message:
        "Signup successful. Please check your email to confirm your account.",
      user: {
        id: userId,
        phone,
        email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong in signup controller." });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    setTokens(res, data.session);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong in login controller." });
  }
};

export const Logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logout Successfully!" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong in logout controller." });
  }
};

export const Verify = (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Email Verified</title>
        <style>
          body { font-family: Arial; padding: 40px; text-align: center; }
          h1 { color: #4CAF50; }
        </style>
      </head>
      <body>
        <h1>Your Email is Verified!</h1>
        <p>You can now log in to your account.</p>
      </body>
    </html>
  `);
};
