import { Request, Response, Router } from "express";
import * as authService from "../services/auth.service";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    // log keys received to help debug missing fields (avoid logging password value)
    try {
      const keys = Object.keys(req.body || {})
      console.debug('[AUTH][REGISTER] received body keys:', keys)
      console.debug('[AUTH][REGISTER] presence:', { name: !!name, email: !!email, password: !!password })
    } catch (e) {
      console.debug('[AUTH][REGISTER] could not inspect body')
    }

    const missing = []
    if (!name) missing.push('name')
    if (!email) missing.push('email')
    if (!password) missing.push('password')
    if (missing.length) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` })
    }

    const result = await authService.register({ name, email, password, role });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // log keys received to help debug missing fields (avoid logging password value)
    try {
      const keys = Object.keys(req.body || {})
      console.debug('[AUTH][LOGIN] received body keys:', keys)
      console.debug('[AUTH][LOGIN] presence:', { email: email, password: password })
    } catch (e) {
      console.debug('[AUTH][LOGIN] could not inspect body')
    }
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
