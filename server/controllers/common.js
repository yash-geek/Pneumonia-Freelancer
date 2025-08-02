export const getUserRole = (req, res) => {
  // If `req.user` is set by middleware, just return it
  if (req.user && req.user.role) {
    return res.status(200).json({ role: req.user.role });
  }
  return res.status(403).json({ message: "Not authenticated" });
};
