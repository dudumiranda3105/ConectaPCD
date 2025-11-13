import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Briefcase, Shield } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">ConectaPCD</span>
          </Link>
        </div>

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
          <SheetContent side="left">
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
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Cadastrar</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild title="Área administrativa">
            <Link to="/admin/login">
              <Shield className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
