import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Briefcase, Shield } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg relative">
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ConectaPCD</span>
          </Link>
        </div>

        {/* Navegação desktop */}
        <nav className="mx-2 hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative group ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'
              }`
            }
          >
            Início
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 transition-all group-hover:w-full" />
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative group ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'
              }`
            }
          >
            Vagas
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 transition-all group-hover:w-full" />
          </NavLink>
          <NavLink
            to="/companies"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative group ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'
              }`
            }
          >
            Empresas
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 transition-all group-hover:w-full" />
          </NavLink>
          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative group ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'
              }`
            }
          >
            Sobre
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 transition-all group-hover:w-full" />
          </NavLink>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-secondary">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold">ConectaPCD</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/jobs" className="text-lg font-medium">
                Vagas
              </Link>
              <Link to="/companies" className="text-lg font-medium">
                Empresas
              </Link>
              <Link to="/sobre" className="text-lg font-medium">
                Sobre
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <Button variant="ghost" className="hover:bg-indigo-50 dark:hover:bg-indigo-950/50" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg" asChild>
            <Link to="/cadastro">Cadastrar</Link>
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-indigo-50 dark:hover:bg-indigo-950/50" asChild title="Área administrativa">
            <Link to="/admin/login">
              <Shield className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
