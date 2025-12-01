import { Request, Response } from "express";
export declare const AcessibilidadesController: {
    list(_req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    seedMissing(_req: Request, res: Response): Promise<void>;
    listBarreiras(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    connect(req: Request, res: Response): Promise<void>;
    disconnect(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=acessibilidades.controller.d.ts.map