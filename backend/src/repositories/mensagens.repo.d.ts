export declare const MensagensRepo: {
    getOrCreateConversa(candidaturaId: number): Promise<{
        candidatura: {
            id: number;
            vaga: {
                empresa: {
                    id: number;
                    nome: string;
                    email: string | null;
                };
            } & {
                id: number;
                descricao: string;
                createdAt: Date;
                updatedAt: Date;
                empresaId: number;
                escolaridade: string;
                isActive: boolean;
                titulo: string;
                beneficios: string | null;
                regimeTrabalho: string | null;
                tipo: string | null;
                views: number;
            };
            candidato: {
                id: number;
                nome: string;
                email: string | null;
                avatarUrl: string | null;
            };
            status: string;
        };
        mensagens: {
            id: number;
            createdAt: Date;
            conversaId: number;
            conteudo: string;
            remetenteId: number;
            tipoRemetente: string;
            lida: boolean;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        candidaturaId: number;
    }>;
    getConversaById(conversaId: number): Promise<({
        candidatura: {
            id: number;
            vaga: {
                empresa: {
                    id: number;
                    nome: string;
                    email: string | null;
                };
            } & {
                id: number;
                descricao: string;
                createdAt: Date;
                updatedAt: Date;
                empresaId: number;
                escolaridade: string;
                isActive: boolean;
                titulo: string;
                beneficios: string | null;
                regimeTrabalho: string | null;
                tipo: string | null;
                views: number;
            };
            candidato: {
                id: number;
                nome: string;
                email: string | null;
                avatarUrl: string | null;
            };
            status: string;
        };
        mensagens: {
            id: number;
            createdAt: Date;
            conversaId: number;
            conteudo: string;
            remetenteId: number;
            tipoRemetente: string;
            lida: boolean;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        candidaturaId: number;
    }) | null>;
    listarConversasCandidato(candidatoId: number): Promise<({
        candidatura: {
            vaga: {
                empresa: {
                    id: number;
                    nome: string;
                };
            } & {
                id: number;
                descricao: string;
                createdAt: Date;
                updatedAt: Date;
                empresaId: number;
                escolaridade: string;
                isActive: boolean;
                titulo: string;
                beneficios: string | null;
                regimeTrabalho: string | null;
                tipo: string | null;
                views: number;
            };
            candidato: {
                id: number;
                nome: string;
                avatarUrl: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vagaId: number;
            candidatoId: number;
            status: string;
        };
        mensagens: {
            id: number;
            createdAt: Date;
            conversaId: number;
            conteudo: string;
            remetenteId: number;
            tipoRemetente: string;
            lida: boolean;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        candidaturaId: number;
    })[]>;
    listarConversasEmpresa(empresaId: number): Promise<({
        candidatura: {
            vaga: {
                id: number;
                titulo: string;
            };
            candidato: {
                id: number;
                nome: string;
                avatarUrl: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vagaId: number;
            candidatoId: number;
            status: string;
        };
        mensagens: {
            id: number;
            createdAt: Date;
            conversaId: number;
            conteudo: string;
            remetenteId: number;
            tipoRemetente: string;
            lida: boolean;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        candidaturaId: number;
    })[]>;
    enviarMensagem(conversaId: number, remetenteId: number, tipoRemetente: string, conteudo: string): Promise<{
        id: number;
        createdAt: Date;
        conversaId: number;
        conteudo: string;
        remetenteId: number;
        tipoRemetente: string;
        lida: boolean;
    }>;
    getMensagens(conversaId: number): Promise<{
        id: number;
        createdAt: Date;
        conversaId: number;
        conteudo: string;
        remetenteId: number;
        tipoRemetente: string;
        lida: boolean;
    }[]>;
    marcarComoLidas(conversaId: number, tipoLeitor: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    contarNaoLidas(conversaId: number, tipoLeitor: string): Promise<number>;
    contarTotalNaoLidas(userId: number, tipoUsuario: string): Promise<number>;
};
//# sourceMappingURL=mensagens.repo.d.ts.map