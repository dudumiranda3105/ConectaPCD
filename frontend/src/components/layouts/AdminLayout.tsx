import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/dashboard/admin/AdminSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { AccessibilityButton } from '../AccessibilityButton'

export const AdminLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="fixed flex h-full max-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
          <AdminSidebar />
        </div>
      </div>
      <div className="flex flex-col">
        <DashboardHeader logoText="Admin" role="admin" />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
        <AccessibilityButton />
      </div>
    </div>
  )
}
