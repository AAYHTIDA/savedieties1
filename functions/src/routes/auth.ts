import { Router } from "express";
import * as admin from "firebase-admin";

const router = Router();

// Create admin user (for initial setup)
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Create user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    // Set admin custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    res.json({
      message: "Admin user created successfully",
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify token and get user info
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    res.json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        admin: decodedToken.admin || false,
      },
    });
  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(403).json({ error: "Invalid token" });
  }
});

export { router as authRouter };