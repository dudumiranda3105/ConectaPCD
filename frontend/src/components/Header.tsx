import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Briefcase, Shield, LogIn, UserPlus } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Linha gradiente decorativa no topo */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600" />
      
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-xl group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-105">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            ConectaPCD
          </span>
        </Link>

        {/* Navegação desktop - centralizada */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-all relative group py-1 ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            Início
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full rounded-full" />
          </NavLink>
          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              `text-sm font-medium transition-all relative group py-1 ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            Sobre
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full rounded-full" />
          </NavLink>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10" 
              asChild
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300" 
              asChild
            >
              <Link to="/cadastro" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Cadastrar
              </Link>
            </Button>
          </div>

          {/* Admin button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-purple-500/10" 
            asChild 
            title="Área administrativa"
          >
            <Link to="/admin/login">
              <Shield className="h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 hover:bg-purple-500/10"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background border-r border-border">
              {/* Logo no menu mobile */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ConectaPCD
                </span>
              </div>

              {/* Links de navegação */}
              <nav className="flex flex-col space-y-1">
                <Link 
                  to="/" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Início
                </Link>
                <Link 
                  to="/sobre" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Sobre
                </Link>
              </nav>

              {/* Botões de ação */}
              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <Link to="/login" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2 border-border hover:border-purple-400 hover:bg-purple-500/10"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" className="block">
                  <Button className="w-full justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                    <UserPlus className="h-4 w-4" />
                    Cadastrar
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
