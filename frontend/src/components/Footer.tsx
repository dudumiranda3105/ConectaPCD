import { Link } from 'react-router-dom'
import { Briefcase, Twitter, Linkedin, Facebook } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="text-secondary-foreground">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ConectaPCD</span>
            </Link>
            <p className="text-muted-foreground text-base">
              Conectando talentos com deficiência a oportunidades de trabalho
              inclusivas.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/privacidade"
                      className="text-base text-muted-foreground hover:text-primary"
                    >
                      Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/termos"
                      className="text-base text-muted-foreground hover:text-primary"
                    >
                      Termos
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
               <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  Empresa
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-base text-muted-foreground hover:text-primary"
                    >
                      Sobre
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-base text-muted-foreground hover:text-primary"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">
            &copy; {new Date().getFullYear()} ConectaPCD. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
