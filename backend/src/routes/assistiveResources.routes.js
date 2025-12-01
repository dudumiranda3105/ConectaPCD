"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assistiveResources_controller_1 = require("../controllers/assistiveResources.controller");
const router = (0, express_1.Router)();
router.get('/', assistiveResources_controller_1.AssistiveResourcesController.list);
router.get('/:id', assistiveResources_controller_1.AssistiveResourcesController.getById);
router.post('/', assistiveResources_controller_1.AssistiveResourcesController.create);
router.put('/:id', assistiveResources_controller_1.AssistiveResourcesController.update);
router.delete('/:id', assistiveResources_controller_1.AssistiveResourcesController.delete);
exports.default = router;
//# sourceMappingURL=assistiveResources.routes.js.map