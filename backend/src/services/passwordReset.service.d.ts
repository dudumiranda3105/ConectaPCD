export declare const PasswordResetService: {
    requestReset(email: string, userType: "candidato" | "empresa"): Promise<{
        success: boolean;
        message: string;
    }>;
    validateToken(token: string, userType: "candidato" | "empresa"): Promise<{
        valid: boolean;
        message: string;
        userId?: undefined;
        userType?: undefined;
    } | {
        valid: boolean;
        userId: any;
        userType: "empresa" | "candidato";
        message?: undefined;
    }>;
    resetPassword(token: string, newPassword: string, userType: "candidato" | "empresa"): Promise<{
        success: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=passwordReset.service.d.ts.map