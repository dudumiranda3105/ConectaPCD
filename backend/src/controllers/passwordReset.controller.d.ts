import { Request, Response } from 'express';
export declare const PasswordResetController: {
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    validateToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=passwordReset.controller.d.ts.map