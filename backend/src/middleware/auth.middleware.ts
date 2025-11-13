import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_this'

export interface TokenPayload {
  userId: number
  role: string
  iat?: number
  exp?: number
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = (req.headers.authorization || '').split(' ')
  if (auth.length !== 2 || auth[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const token = auth[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    // anexa informações ao req
    ;(req as any).user = { id: payload.userId, role: payload.role }
    next()
  } catch (err: any) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
