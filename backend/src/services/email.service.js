"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuração do transporter (usar variáveis de ambiente em produção)
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});
// Templates de email
const templates = {
    // Template de boas-vindas para candidato
    welcomeCandidate: (nome) => ({
        subject: '🎉 Bem-vindo ao ConectaPCD!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1f2937; margin-top: 0; }
          .content p { color: #4b5563; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .features { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature { display: flex; align-items: center; margin: 10px 0; }
          .feature-icon { width: 24px; height: 24px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 ConectaPCD</h1>
          </div>
          <div class="content">
            <h2>Olá, ${nome}! 👋</h2>
            <p>Seja muito bem-vindo(a) ao <strong>ConectaPCD</strong>! Estamos felizes em ter você conosco.</p>
            <p>Sua conta foi criada com sucesso e você já pode começar a explorar oportunidades de emprego em empresas que valorizam a diversidade e inclusão.</p>
            
            <div class="features">
              <h3 style="margin-top: 0; color: #374151;">O que você pode fazer agora:</h3>
              <p>✅ Complete seu perfil com suas informações</p>
              <p>✅ Adicione suas deficiências e necessidades de acessibilidade</p>
              <p>✅ Faça upload do seu currículo</p>
              <p>✅ Explore vagas compatíveis com seu perfil</p>
            </div>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/login" class="button">Acessar Minha Conta</a>
            </center>
            
            <p>Se tiver qualquer dúvida, estamos aqui para ajudar!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD - Conectando Talentos a Oportunidades</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
    // Template de boas-vindas para empresa
    welcomeCompany: (nomeEmpresa) => ({
        subject: '🏢 Bem-vindo ao ConectaPCD - Sua empresa está cadastrada!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1f2937; margin-top: 0; }
          .content p { color: #4b5563; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .stats { display: flex; justify-content: space-around; background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .stat { flex: 1; }
          .stat-number { font-size: 24px; font-weight: bold; color: #8B5CF6; }
          .stat-label { font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 ConectaPCD</h1>
          </div>
          <div class="content">
            <h2>Bem-vinda, ${nomeEmpresa}! 🎉</h2>
            <p>Sua empresa foi cadastrada com sucesso no <strong>ConectaPCD</strong>!</p>
            <p>Agora você tem acesso a uma base de talentos qualificados que estão em busca de oportunidades em empresas inclusivas como a sua.</p>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">1000+</div>
                <div class="stat-label">Candidatos PCD</div>
              </div>
              <div class="stat">
                <div class="stat-number">100%</div>
                <div class="stat-label">Acessível</div>
              </div>
              <div class="stat">
                <div class="stat-number">Match</div>
                <div class="stat-label">Inteligente</div>
              </div>
            </div>
            
            <p><strong>Próximos passos:</strong></p>
            <p>✅ Complete o perfil da sua empresa</p>
            <p>✅ Cadastre as acessibilidades que você oferece</p>
            <p>✅ Publique sua primeira vaga</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/login" class="button">Acessar Painel</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD - Conectando Talentos a Oportunidades</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
    // Template de nova candidatura (para empresa)
    newApplication: (nomeEmpresa, nomeCandidato, tituloVaga) => ({
        subject: `📩 Nova candidatura para: ${tituloVaga}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #0EA5E9 100%); padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .content h2 { color: #1f2937; margin-top: 0; }
          .content p { color: #4b5563; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(135deg, #10B981 0%, #0EA5E9 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10B981; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 Nova Candidatura!</h1>
          </div>
          <div class="content">
            <h2>Olá, ${nomeEmpresa}!</h2>
            <p>Você recebeu uma nova candidatura para uma de suas vagas.</p>
            
            <div class="card">
              <p><strong>👤 Candidato:</strong> ${nomeCandidato}</p>
              <p><strong>💼 Vaga:</strong> ${tituloVaga}</p>
              <p><strong>📅 Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <p>Acesse o painel para ver o perfil completo do candidato e entrar em contato.</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/dashboard/empresa/candidaturas" class="button">Ver Candidatura</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
    // Template de candidatura aceita (para candidato)
    applicationAccepted: (nomeCandidato, nomeEmpresa, tituloVaga) => ({
        subject: `✅ Boa notícia! Sua candidatura foi aceita - ${tituloVaga}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #34D399 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #10B981 0%, #34D399 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .card { background: #ECFDF5; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #10B981; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Parabéns!</h1>
          </div>
          <div class="content">
            <h2 style="color: #10B981;">Sua candidatura foi aceita!</h2>
            <p>Olá, <strong>${nomeCandidato}</strong>!</p>
            <p>Temos uma ótima notícia: sua candidatura foi aceita pela empresa!</p>
            
            <div class="card">
              <p><strong>🏢 Empresa:</strong> ${nomeEmpresa}</p>
              <p><strong>💼 Vaga:</strong> ${tituloVaga}</p>
            </div>
            
            <p>A empresa agora pode entrar em contato com você através do chat da plataforma. Fique atento às mensagens!</p>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/dashboard/candidato/candidaturas" class="button">Ver Detalhes</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD - Boa sorte! 🍀</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
    // Template de contratação (para candidato)
    hired: (nomeCandidato, nomeEmpresa, tituloVaga) => ({
        subject: `🎊 PARABÉNS! Você foi contratado(a) - ${nomeEmpresa}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .confetti { font-size: 40px; }
          .content { padding: 40px 30px; text-align: center; }
          .big-check { font-size: 80px; margin: 20px 0; }
          .card { background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 12px; padding: 25px; margin: 20px 0; border: 2px solid #F59E0B; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="confetti">🎊🎉🎊</div>
            <h1>VOCÊ FOI CONTRATADO(A)!</h1>
          </div>
          <div class="content">
            <div class="big-check">✅</div>
            <h2 style="color: #F59E0B;">Parabéns, ${nomeCandidato}!</h2>
            <p style="font-size: 18px; color: #4b5563;">Esta é uma conquista incrível!</p>
            
            <div class="card">
              <p style="margin: 0;"><strong>🏢 Empresa:</strong> ${nomeEmpresa}</p>
              <p style="margin: 10px 0 0 0;"><strong>💼 Cargo:</strong> ${tituloVaga}</p>
            </div>
            
            <p>A empresa entrará em contato em breve com os próximos passos do processo de admissão.</p>
            <p style="font-size: 14px; color: #6b7280;">Desejamos muito sucesso nessa nova jornada! 🚀</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD - Sua história de sucesso começa agora!</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
    // Template de recuperação de senha
    passwordReset: (nome, resetLink) => ({
        subject: '🔐 Recuperação de Senha - ConectaPCD',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .warning { background: #FEF3C7; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #F59E0B; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperação de Senha</h1>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no ConectaPCD.</p>
            
            <center>
              <a href="${resetLink}" class="button">Redefinir Minha Senha</a>
            </center>
            
            <div class="warning">
              <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
              <p style="margin: 5px 0 0 0;">Este link expira em <strong>1 hora</strong>. Se você não solicitou esta alteração, ignore este email.</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="font-size: 12px; word-break: break-all; color: #8B5CF6;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
    // Template de nova mensagem no chat
    newMessage: (nomeDestinatario, nomeRemetente, preview) => ({
        subject: `💬 Nova mensagem de ${nomeRemetente}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 25px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 22px; }
          .content { padding: 30px; }
          .message-box { background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #3B82F6; }
          .button { display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .footer { background: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Nova Mensagem</h1>
          </div>
          <div class="content">
            <p>Olá, <strong>${nomeDestinatario}</strong>!</p>
            <p>Você recebeu uma nova mensagem de <strong>${nomeRemetente}</strong>:</p>
            
            <div class="message-box">
              <p style="margin: 0; color: #374151;">"${preview.substring(0, 150)}${preview.length > 150 ? '...' : ''}"</p>
            </div>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}/dashboard/chat" class="button">Responder</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ConectaPCD</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
};
exports.EmailService = {
    // Enviar email genérico
    async send(to, subject, html) {
        try {
            // Em desenvolvimento, apenas loga
            if (!process.env.SMTP_USER || process.env.NODE_ENV === 'development') {
                console.log('📧 [EMAIL SIMULADO]');
                console.log(`   Para: ${to}`);
                console.log(`   Assunto: ${subject}`);
                console.log('   (Configure SMTP_USER e SMTP_PASS para enviar emails reais)');
                return { success: true, simulated: true };
            }
            const info = await transporter.sendMail({
                from: `"ConectaPCD" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
            console.log(`📧 Email enviado: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            return { success: false, error };
        }
    },
    // Métodos específicos usando templates
    async sendWelcomeCandidate(email, nome) {
        const { subject, html } = templates.welcomeCandidate(nome);
        return this.send(email, subject, html);
    },
    async sendWelcomeCompany(email, nomeEmpresa) {
        const { subject, html } = templates.welcomeCompany(nomeEmpresa);
        return this.send(email, subject, html);
    },
    async sendNewApplication(emailEmpresa, nomeEmpresa, nomeCandidato, tituloVaga) {
        const { subject, html } = templates.newApplication(nomeEmpresa, nomeCandidato, tituloVaga);
        return this.send(emailEmpresa, subject, html);
    },
    async sendApplicationAccepted(emailCandidato, nomeCandidato, nomeEmpresa, tituloVaga) {
        const { subject, html } = templates.applicationAccepted(nomeCandidato, nomeEmpresa, tituloVaga);
        return this.send(emailCandidato, subject, html);
    },
    async sendHired(emailCandidato, nomeCandidato, nomeEmpresa, tituloVaga) {
        const { subject, html } = templates.hired(nomeCandidato, nomeEmpresa, tituloVaga);
        return this.send(emailCandidato, subject, html);
    },
    async sendPasswordReset(email, nome, resetToken) {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/reset-password?token=${resetToken}`;
        const { subject, html } = templates.passwordReset(nome, resetLink);
        return this.send(email, subject, html);
    },
    async sendNewMessage(email, nomeDestinatario, nomeRemetente, preview) {
        const { subject, html } = templates.newMessage(nomeDestinatario, nomeRemetente, preview);
        return this.send(email, subject, html);
    },
};
//# sourceMappingURL=email.service.js.map