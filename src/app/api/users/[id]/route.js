import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectDB(); // Connect to DB

  const { id } = req.query; // Get user ID from URL

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
