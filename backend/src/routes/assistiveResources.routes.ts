import { Router } from 'express'
import { AssistiveResourcesController } from '../controllers/assistiveResources.controller'

const router = Router()

router.get('/', AssistiveResourcesController.list)

export default router
