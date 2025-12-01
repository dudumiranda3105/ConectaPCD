import { Router } from 'express'
import { AssistiveResourcesController } from '../controllers/assistiveResources.controller'

const router = Router()

router.get('/', AssistiveResourcesController.list)
router.get('/:id', AssistiveResourcesController.getById)
router.post('/', AssistiveResourcesController.create)
router.put('/:id', AssistiveResourcesController.update)
router.delete('/:id', AssistiveResourcesController.delete)

export default router
