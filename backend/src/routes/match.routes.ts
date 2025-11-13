// src/routes/match.routes.ts
import { Router } from "express";
import { MatchController } from "../controllers/match.controller";

export const matchRoutes = Router();

// GET /match/:candidatoId
matchRoutes.get("/:candidatoId", MatchController.listarVagasCompativeis);
