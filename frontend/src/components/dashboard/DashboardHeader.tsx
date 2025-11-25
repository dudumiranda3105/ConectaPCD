import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Briefcase, Shield } from 'lucide-react'
import { AdminSidebar } from './admin/AdminSidebar'
import { CandidateSidebar } from './candidate/CandidateSidebar'
import { CompanySidebar } from './company/CompanySidebar'

interface DashboardHeaderProps {
  logoText: string
  role: 'admin' | 'candidate' | 'company'
}

const sidebarMap = {
  admin: <AdminSidebar />,
  candidate: <CandidateSidebar />,
  company: <CompanySidebar />,
}

const iconMap = {
  admin: <Shield className="h-6 w-6 text-primary" />,
  candidate: <Briefcase className="h-6 w-6 text-primary" />,
  company: <Briefcase className="h-6 w-6 text-primary" />,
}

export const DashboardHeader = ({ logoText, role }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-3 sm:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="md:hidden h-9 w-9 sm:h-10 sm:w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] xs:w-[300px] sm:max-w-xs">
          {sidebarMap[role]}
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 md:hidden">
        {iconMap[role]}
        <span className="font-bold text-sm sm:text-base truncate">{logoText}</span>
      </div>
    </header>
  )
}
