export declare const EmailService: {
    send(to: string, subject: string, html: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendWelcomeCandidate(email: string, nome: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendWelcomeCompany(email: string, nomeEmpresa: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendNewApplication(emailEmpresa: string, nomeEmpresa: string, nomeCandidato: string, tituloVaga: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendApplicationAccepted(emailCandidato: string, nomeCandidato: string, nomeEmpresa: string, tituloVaga: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendHired(emailCandidato: string, nomeCandidato: string, nomeEmpresa: string, tituloVaga: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendPasswordReset(email: string, nome: string, resetToken: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
    sendNewMessage(email: string, nomeDestinatario: string, nomeRemetente: string, preview: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
        simulated?: undefined;
        messageId?: undefined;
    }>;
};
//# sourceMappingURL=email.service.d.ts.map