import { Request, Response } from "express";
export declare const BarreirasController: {
    list(_req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    listAcessibilidades(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    connect(req: Request, res: Response): Promise<void>;
    disconnect(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=barreiras.controller.d.ts.map