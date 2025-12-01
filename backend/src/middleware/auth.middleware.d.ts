import { Request, Response, NextFunction } from 'express';
export interface TokenPayload {
    userId: number;
    role: string;
    userType: 'candidato' | 'empresa' | 'admin';
    iat?: number;
    exp?: number;
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const companyOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const candidateOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map