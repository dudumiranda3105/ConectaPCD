import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limiter geral - 500 requisições por minuto (aumentado para suportar recálculo de matches)
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 500,
  message: {
    error: 'Muitas requisições. Por favor, aguarde um momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite geral`);
    res.status(429).json({
      error: 'Muitas requisições. Por favor, aguarde um momento.',
      retryAfter: 60,
    });
  },
});

// Rate limiter para autenticação - 5 tentativas por minuto
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: {
    error: 'Muitas tentativas de login. Aguarde 1 minuto.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite de auth`);
    res.status(429).json({
      error: 'Muitas tentativas de login. Aguarde 1 minuto.',
      retryAfter: 60,
    });
  },
});

// Rate limiter para registro - 3 por hora
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    error: 'Limite de registros excedido. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite de registro`);
    res.status(429).json({
      error: 'Limite de registros excedido. Tente novamente mais tarde.',
      retryAfter: 3600,
    });
  },
});

// Rate limiter para reset de senha - 3 por hora
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    error: 'Muitas solicitações de reset de senha. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite de reset de senha`);
    res.status(429).json({
      error: 'Muitas solicitações de reset de senha. Tente novamente mais tarde.',
      retryAfter: 3600,
    });
  },
});

// Rate limiter para upload - 10 por hora
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: {
    error: 'Limite de uploads excedido. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite de upload`);
    res.status(429).json({
      error: 'Limite de uploads excedido. Tente novamente mais tarde.',
      retryAfter: 3600,
    });
  },
});

// Rate limiter para candidaturas - 20 por hora
export const candidaturaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20,
  message: {
    error: 'Limite de candidaturas excedido. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite de candidatura`);
    res.status(429).json({
      error: 'Limite de candidaturas excedido. Tente novamente mais tarde.',
      retryAfter: 3600,
    });
  },
});

// Rate limiter para mensagens - 60 por minuto
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60,
  message: {
    error: 'Limite de mensagens excedido. Aguarde um momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.warn(`[RATE_LIMIT] IP ${req.ip} excedeu limite de mensagens`);
    res.status(429).json({
      error: 'Limite de mensagens excedido. Aguarde um momento.',
      retryAfter: 60,
    });
  },
});

// Rate limiter para API de stats - 30 por minuto
export const statsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  message: {
    error: 'Muitas requisições. Aguarde um momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
