import connectDb from "@/library/connectDb";
export default function handler(req, res) {
  connectDb();
  res.status(200).json({ name: "John Doe" });
}
