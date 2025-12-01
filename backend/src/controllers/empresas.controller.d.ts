import { Request, Response } from "express";
export declare const EmpresasController: {
    listar(req: Request, res: Response): Promise<void>;
    detalhar(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    criar(req: Request, res: Response): Promise<void>;
    stats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarCandidaturasEmProcesso(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarCandidaturasAprovadas(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=empresas.controller.d.ts.map