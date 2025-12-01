import { Request, Response } from 'express';
export declare const getPublicStats: (_req: Request, res: Response) => Promise<void>;
export declare const AdminController: {
    getStats(req: Request, res: Response): Promise<void>;
    getActivities(req: Request, res: Response): Promise<void>;
    getUsers(req: Request, res: Response): Promise<void>;
    getAdmins(req: Request, res: Response): Promise<void>;
    getCompanies(req: Request, res: Response): Promise<void>;
    getJobsForModeration(req: Request, res: Response): Promise<void>;
    moderateJob(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getEngagementMetrics(req: Request, res: Response): Promise<void>;
    getAccessibilityMetrics(req: Request, res: Response): Promise<void>;
    createAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=admin.controller.d.ts.map