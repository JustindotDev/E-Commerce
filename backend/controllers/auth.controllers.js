import supabase from "../config/db.js";
import { validatePassword } from "../util/password.validator.js";
import { setTokens } from "../util/setToken.js";

export const Signup = async (req, res) => {
  const { countryCode, phone, email, password } = req.body;
  const phoneNumber = countryCode + phone;
  try {
    if (!phoneNumber) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const { data: userPhone } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phoneNumber)
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
        phone: phoneNumber,
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
        phone: phoneNumber,
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
  const { identifier, password } = req.body;

  if (!identifier) {
    return res.status(400).json({ emailError: "Missing required fields." });
  }
  if (!password) {
    return res.status(400).json({ passwordError: "Missing required fields." });
  }
  try {
    let data, error;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+\d{10,15}$/.test(identifier);
    if (isEmail) {
      // First check if the email exists
      const { data: userData } = await supabase
        .from("users")
        .select("email")
        .eq("email", identifier)
        .single();

      if (!userData) {
        return res.status(401).json({
          emailError: "Email not found",
        });
      }

      // If email exists, try to login
      ({ data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      }));

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return res.status(401).json({
            passwordError: "Incorrect password",
          });
        }
        if (error.message.includes("Email not confirmed")) {
          return res.status(401).json({
            emailError: "Please verify your email address",
          });
        }
        return res.status(401).json({
          emailError: error.message,
        });
      }
    } else if (isPhone) {
      ({ data, error } = await supabase.auth.signInWithPassword({
        phone: identifier,
        password,
      }));
      if (error) {
        return res.status(401).json({ message: error.message });
      }
    } else {
      return res.status(400).json({ message: "Invalid identifier format" });
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

export const OAuthCallback = async (req, res) => {
  const { access_token, refresh_token } = req.body;

  if (!access_token || !refresh_token) {
    return res.status(400).json({ message: "Missing tokens" });
  }

  try {
    // Verify the tokens with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid tokens" });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (!userData) {
      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          username: user.user_metadata?.full_name,
          email: user.email,
          phone: user?.phone,
        })
        .select();
    }

    setTokens(res, { access_token, refresh_token });

    return res.status(200).json({
      message: "OAuth login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error.message);
    res.status(500).json({ message: "Something went wrong in OAuth callback" });
  }
};
