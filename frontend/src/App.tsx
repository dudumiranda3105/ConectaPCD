import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './providers/AuthProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AccessibilityProvider } from './providers/AccessibilityProvider'
import Layout from './components/Layout'
import { CandidateLayout } from './components/layouts/CandidateLayout'
import { CompanyLayout } from './components/layouts/CompanyLayout'
import { AdminLayout } from './components/layouts/AdminLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import LoginPage from './pages/auth/Login'
import ProfileSelectorPage from './pages/auth/ProfileSelector'
import CandidateSignupPage from './pages/auth/CandidateSignup'
import CompanySignupPage from './pages/auth/CompanySignup'
import AdminLoginPage from './pages/auth/AdminLogin'
import AdminSignupPage from './pages/auth/AdminSignup'
import CandidateDashboard from './pages/dashboard/candidate/CandidateDashboard'
import CandidateProfilePage from './pages/dashboard/candidate/ProfilePage'
import CandidateSettingsPage from './pages/dashboard/candidate/SettingsPage'
import JobDetailsPage from './pages/dashboard/candidate/JobDetailsPage'
import MatchesPage from './pages/dashboard/candidate/MatchesPage'
import CompanyDashboard from './pages/dashboard/company/CompanyDashboard'
import CompanyJobDetailsPage from './pages/dashboard/company/JobDetailsPage'
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import ResumesPage from './pages/dashboard/company/ResumesPage'
import AnalyticsPage from './pages/dashboard/company/AnalyticsPage'
import SettingsPage from './pages/dashboard/company/SettingsPage'
import JobCandidatesPage from './pages/dashboard/company/JobCandidatesPage'
import AdminUsersPage from './pages/dashboard/admin/UsersPage'
import AdminCompaniesPage from './pages/dashboard/admin/CompaniesPage'
import AdminJobsPage from './pages/dashboard/admin/JobsPage'
import AdminSettingsPage from './pages/dashboard/admin/SettingsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import TermsOfUsePage from './pages/TermsOfUse'
import AboutPage from './pages/AboutPage'
import SystemManagementPage from './pages/dashboard/admin/SystemManagementPage'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastro" element={<ProfileSelectorPage />} />
                <Route
                  path="/cadastro/candidato"
                  element={<CandidateSignupPage />}
                />
                <Route
                  path="/cadastro/empresa"
                  element={<CompanySignupPage />}
                />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/cadastro" element={<AdminSignupPage />} />
                <Route path="/privacidade" element={<PrivacyPolicyPage />} />
                <Route path="/termos" element={<TermsOfUsePage />} />
                <Route path="/sobre" element={<AboutPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
                <Route element={<CandidateLayout />}>
                  <Route
                    path="/dashboard/candidato"
                    element={<CandidateDashboard />}
                  />
                  <Route
                    path="/dashboard/candidato/vaga/:jobId"
                    element={<JobDetailsPage />}
                  />
                  <Route
                    path="/dashboard/candidato/vagas-recomendadas"
                    element={<MatchesPage />}
                  />
                  <Route
                    path="/dashboard/candidato/perfil"
                    element={<CandidateProfilePage />}
                  />
                  <Route
                    path="/dashboard/candidato/configuracoes"
                    element={<CandidateSettingsPage />}
                  />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['company']} />}>
                <Route element={<CompanyLayout />}>
                  <Route
                    path="/dashboard/empresa"
                    element={<CompanyDashboard />}
                  />
                  <Route
                    path="/dashboard/empresa/vagas/:jobId"
                    element={<CompanyJobDetailsPage />}
                  />
                  <Route
                    path="/dashboard/empresa/vagas/:jobId/candidatos"
                    element={<JobCandidatesPage />}
                  />
                  <Route
                    path="/dashboard/empresa/curriculos"
                    element={<ResumesPage />}
                  />
                  <Route
                    path="/dashboard/empresa/analises"
                    element={<AnalyticsPage />}
                  />
                  <Route
                    path="/dashboard/empresa/configuracoes"
                    element={<SettingsPage />}
                  />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route
                    path="/admin/companies"
                    element={<AdminCompaniesPage />}
                  />
                  <Route path="/admin/jobs" element={<AdminJobsPage />} />
                  <Route
                    path="/admin/system"
                    element={<SystemManagementPage />}
                  />
                  <Route
                    path="/admin/settings"
                    element={<AdminSettingsPage />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
