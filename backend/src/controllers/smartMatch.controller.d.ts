import { Request, Response } from 'express';
export declare const SmartMatchController: {
    /**
     * GET /smart-match/candidato/:candidatoId/vagas
     * Busca vagas com smart match para um candidato
     */
    buscarVagasSmartMatch(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /smart-match/candidato/:candidatoId/vaga/:vagaId
     * Calcula smart match específico entre candidato e vaga
     */
    calcularSmartMatch(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /smart-match/vaga/:vagaId/top-candidatos
     * Busca os melhores candidatos para uma vaga
     */
    buscarTopCandidatos(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=smartMatch.controller.d.ts.map