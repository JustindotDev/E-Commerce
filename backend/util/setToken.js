export const setTokens = (res, session) => {
  res.cookie("access_token", session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.cookie("refresh_token", session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
