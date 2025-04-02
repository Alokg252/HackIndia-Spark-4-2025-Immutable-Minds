import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();
const SECRET_KEY = "hackindia"; // Change this in production

// **Register or Login Organization**
router.post("/auth", async (req: Request, res: Response) => {
  try {
    const { name, username, password, isRegistering } = req.body;

    if (isRegistering) {
      // **Register Organization**
      const existingOrg = await prisma.organization.findUnique({ where: { username } });

      if (existingOrg) return res.status(400).json({ error: "Username already taken!" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newOrg = await prisma.organization.create({
        data: { name, username, password: hashedPassword },
      });

      return res.status(201).json(newOrg);
    } else {
      // **Login Organization**
      const org = await prisma.organization.findUnique({ where: { username } });

      if (!org || !(await bcrypt.compare(password, org.password))) {
        return res.status(401).json({ error: "Invalid credentials!" });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: org.id, username: org.username }, SECRET_KEY, { expiresIn: "1h" });

      return res.status(200).json({ token, org });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error!" });
  }
});

export default router;
