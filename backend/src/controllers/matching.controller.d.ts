import { Request, Response } from 'express';
export declare const MatchingController: {
    /**
     * GET /matching/candidato/:candidatoId/vagas
     * Busca as melhores vagas para um candidato
     */
    buscarVagasParaCandidato(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /matching/vaga/:vagaId/candidatos
     * Busca os melhores candidatos para uma vaga
     */
    buscarCandidatosParaVaga(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /matching/candidato/:candidatoId/vaga/:vagaId
     * Calcula compatibilidade específica entre candidato e vaga
     */
    calcularCompatibilidade(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=matching.controller.d.ts.map