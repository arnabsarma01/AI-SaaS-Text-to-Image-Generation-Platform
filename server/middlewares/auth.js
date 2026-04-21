import jwt from "jsonwebtoken"

const userAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.json({ success: false, message: "Not Authorized. Login Again" })
    }

    const token = authHeader.split(" ")[1] // Bearer <token>

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id   // ✅ attach userId properly

    next()
  } catch (error) {
    return res.json({ success: false, message: "Not Authorized. Login Again" })
  }
}

export default userAuth
