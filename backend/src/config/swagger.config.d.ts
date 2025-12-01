export declare const swaggerSpec: object;
export declare const swaggerDocs: {
    '/auth/register': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                201: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                400: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
            };
        };
    };
    '/auth/login': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                200: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                401: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
            };
        };
    };
    '/auth/forgot-password': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                200: {
                    description: string;
                };
                400: {
                    description: string;
                };
            };
        };
    };
    '/auth/reset-password': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                200: {
                    description: string;
                };
                400: {
                    description: string;
                };
            };
        };
    };
    '/vagas': {
        get: {
            tags: string[];
            summary: string;
            description: string;
            parameters: ({
                name: string;
                in: string;
                schema: {
                    type: string;
                    default: number;
                };
            } | {
                name: string;
                in: string;
                schema: {
                    type: string;
                    default?: undefined;
                };
            })[];
            responses: {
                200: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                items: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        post: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                bearerAuth: never[];
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                201: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                401: {
                    description: string;
                };
            };
        };
    };
    '/vagas/{id}': {
        get: {
            tags: string[];
            summary: string;
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            responses: {
                200: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                404: {
                    description: string;
                };
            };
        };
        put: {
            tags: string[];
            summary: string;
            security: {
                bearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                200: {
                    description: string;
                };
                401: {
                    description: string;
                };
                404: {
                    description: string;
                };
            };
        };
        delete: {
            tags: string[];
            summary: string;
            security: {
                bearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            responses: {
                200: {
                    description: string;
                };
                401: {
                    description: string;
                };
            };
        };
    };
    '/candidaturas': {
        post: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                bearerAuth: never[];
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                vagaId: {
                                    type: string;
                                };
                                mensagem: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            responses: {
                201: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                401: {
                    description: string;
                };
                400: {
                    description: string;
                };
            };
        };
    };
    '/candidaturas/{id}/status': {
        patch: {
            tags: string[];
            summary: string;
            security: {
                bearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                status: {
                                    type: string;
                                    enum: string[];
                                };
                            };
                        };
                    };
                };
            };
            responses: {
                200: {
                    description: string;
                };
                401: {
                    description: string;
                };
            };
        };
    };
    '/matching/candidato/{candidatoId}': {
        get: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                bearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/matching/vaga/{vagaId}': {
        get: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                bearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/stats': {
        get: {
            tags: string[];
            summary: string;
            description: string;
            responses: {
                200: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
            };
        };
    };
    '/mensagens/conversas': {
        get: {
            tags: string[];
            summary: string;
            description: string;
            security: {
                bearerAuth: never[];
            }[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/mensagens/conversas/{conversaId}': {
        get: {
            tags: string[];
            summary: string;
            security: {
                bearerAuth: never[];
            }[];
            parameters: {
                name: string;
                in: string;
                required: boolean;
                schema: {
                    type: string;
                };
            }[];
            responses: {
                200: {
                    description: string;
                };
            };
        };
    };
    '/mensagens/enviar': {
        post: {
            tags: string[];
            summary: string;
            security: {
                bearerAuth: never[];
            }[];
            requestBody: {
                required: boolean;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            required: string[];
                            properties: {
                                conversaId: {
                                    type: string;
                                };
                                conteudo: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            responses: {
                201: {
                    description: string;
                };
            };
        };
    };
};
//# sourceMappingURL=swagger.config.d.ts.map