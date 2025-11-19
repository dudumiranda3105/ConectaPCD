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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 sm:max-w-xs">
          {sidebarMap[role]}
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 sm:hidden">
        {iconMap[role]}
        <span className="font-bold">{logoText}</span>
      </div>
    </header>
  )
}
