import { Request, Response } from 'express';
export declare const AssistiveResourcesController: {
    list(_req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=assistiveResources.controller.d.ts.map