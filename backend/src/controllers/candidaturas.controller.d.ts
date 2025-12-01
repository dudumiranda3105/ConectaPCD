import { Request, Response } from "express";
export declare const CandidaturasController: {
    candidatar(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarPorCandidato(req: Request, res: Response): Promise<void>;
    listarPorVaga(req: Request, res: Response): Promise<void>;
    atualizarStatus(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=candidaturas.controller.d.ts.map