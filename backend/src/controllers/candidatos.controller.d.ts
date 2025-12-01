import { Request, Response } from "express";
export declare const CandidatosController: {
    listar(req: Request, res: Response): Promise<void>;
    buscarPorId(req: Request, res: Response): Promise<void>;
    criar(req: Request, res: Response): Promise<void>;
    listarCandidaturasAprovadas(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=candidatos.controller.d.ts.map