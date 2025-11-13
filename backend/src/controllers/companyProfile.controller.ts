import { Router, Request, Response } from 'express'
import * as companyService from '../services/companyProfile.service'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return res.status(401).json({ error: 'Não autorizado' })
    const saved = await companyService.saveCompanyProfile(user.id, req.body)
    res.status(201).json(saved)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user) return res.status(401).json({ error: 'Não autorizado' })
    const data = await companyService.getCompanyProfile(user.id)
    res.json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
