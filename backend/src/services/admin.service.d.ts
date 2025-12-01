export declare const AdminService: {
    getPublicStats(): Promise<{
        candidates: number;
        companies: number;
        activeJobs: number;
    }>;
    getDashboardStats(): Promise<{
        candidates: number;
        companies: number;
        admins: number;
        activeJobs: number;
        jobsToModerate: number;
    }>;
    getRecentActivities(): Promise<any[]>;
    getUsers(): Promise<{
        id: string;
        name: string;
        email: string;
        disability: string;
        joined: string;
        status: string;
    }[]>;
    getAdmins(): Promise<{
        id: string;
        name: string;
        email: string;
        cargo: string;
        joined: string;
        status: string;
    }[]>;
    getCompanies(): Promise<{
        id: string;
        name: string;
        cnpj: string;
        sector: string;
        joined: string;
        status: string;
    }[]>;
    getJobsForModeration(): Promise<{
        id: string;
        title: string;
        company: string;
        posted: string;
        status: string;
    }[]>;
    moderateJob(jobId: number, status: string): Promise<void>;
    getEngagementMetrics(): Promise<{
        month: string | undefined;
        applications: number;
        newUsers: number;
    }[]>;
    getAccessibilityMetrics(): Promise<{
        type: string;
        offered: number;
    }[]>;
    createAdmin(data: {
        name: string;
        email: string;
        password: string;
        cargo?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        cargo: string;
        joined: string;
        status: string;
    }>;
    deleteAdmin(adminId: number): Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map