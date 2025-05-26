import supabase from "../config/db.js";

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

export const Login = async () => {};

export const Logout = async () => {};

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
