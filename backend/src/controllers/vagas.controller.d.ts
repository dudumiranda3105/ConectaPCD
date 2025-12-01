import { Request, Response } from "express";
export declare const VagasController: {
    listarTodasCandidaturas(req: Request, res: Response): Promise<void>;
    listar(req: Request, res: Response): Promise<void>;
    detalhar(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    criar(req: Request, res: Response): Promise<void>;
    vincularSubtipos(req: Request, res: Response): Promise<void>;
    vincularAcessibilidades(req: Request, res: Response): Promise<void>;
    getAcessibilidadesPossiveis(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarCandidaturas(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    atualizar(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    registrarVisualizacao(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=vagas.controller.d.ts.map