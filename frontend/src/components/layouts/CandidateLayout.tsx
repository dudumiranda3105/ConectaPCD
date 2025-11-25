import { Outlet } from 'react-router-dom'
import { CandidateSidebar } from '@/components/dashboard/candidate/CandidateSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { AccessibilityButton } from '../AccessibilityButton'

export const CandidateLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="fixed flex h-full max-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
          <CandidateSidebar />
        </div>
      </div>
      <div className="flex flex-col">
        <DashboardHeader logoText="ConectaPCD" role="candidate" />
        <main className="flex flex-1 flex-col gap-3 sm:gap-4 px-3 sm:px-4 pb-4 sm:pb-6 pt-4 sm:pt-6 md:pt-8 lg:gap-6 lg:px-8 lg:pb-8 lg:pt-12 transition-padding">
          <Outlet />
        </main>
        <AccessibilityButton />
      </div>
    </div>
  )
}
