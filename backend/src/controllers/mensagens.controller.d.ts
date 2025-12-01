import { Request, Response } from "express";
export declare const MensagensController: {
    getOrCreateConversa(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getConversaById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarConversasCandidato(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarConversasEmpresa(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    enviarMensagem(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMensagens(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    marcarComoLidas(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    contarNaoLidas(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=mensagens.controller.d.ts.map