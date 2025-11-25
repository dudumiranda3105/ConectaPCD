import { Link } from 'react-router-dom'
import { Briefcase, Twitter, Linkedin, Instagram, Mail, Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-violet-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-16">
          {/* Brand */}
          <div className="text-center lg:text-left max-w-md">
            <Link to="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all group-hover:scale-105">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ConectaPCD</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Transformando o mercado de trabalho através da inclusão. Conectamos talentos com deficiência a empresas que valorizam a diversidade.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Vagas</Link></li>
                <li><Link to="/cadastro" className="text-gray-400 hover:text-white transition-colors">Cadastro</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link to="/termos" className="text-gray-400 hover:text-white transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="text-center lg:text-right">
            <h4 className="text-white font-semibold mb-4">Redes Sociais</h4>
            <div className="flex items-center justify-center lg:justify-end gap-3">
              <a href="#" aria-label="Twitter" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-600 text-gray-400 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-600 text-gray-400 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-600 text-gray-400 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:contato@conectapcd.com" aria-label="Email" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-600 text-gray-400 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ConectaPCD. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              Feito com <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> para promover a inclusão
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
