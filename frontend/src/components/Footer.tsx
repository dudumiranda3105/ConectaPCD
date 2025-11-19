import { Link } from 'react-router-dom'
import { Briefcase, Twitter, Linkedin, Facebook } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/20 text-secondary-foreground border-t-2 border-indigo-100 dark:border-indigo-900">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand + Social */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ConectaPCD</span>
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed">
              Conectando talentos com deficiência a oportunidades de trabalho inclusivas.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Twitter" className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:border-transparent hover:text-white transition-all hover:scale-110 hover:shadow-lg">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:border-transparent hover:text-white transition-all hover:scale-110 hover:shadow-lg">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="h-10 w-10 flex items-center justify-center rounded-xl border-2 border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-violet-600 hover:border-transparent hover:text-white transition-all hover:scale-110 hover:shadow-lg">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-5 text-indigo-600 dark:text-indigo-400">Produto</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Vagas</Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Criar conta</Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Área da empresa</Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-5 text-indigo-600 dark:text-indigo-400">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Sobre</Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Blog</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-5 text-indigo-600 dark:text-indigo-400">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Privacidade</Link>
              </li>
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Termos</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t-2 border-indigo-100 dark:border-indigo-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ConectaPCD. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/privacidade" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Privacidade</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/termos" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
