export declare const register: (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
}) => Promise<{
    user: any;
    token: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: any;
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map