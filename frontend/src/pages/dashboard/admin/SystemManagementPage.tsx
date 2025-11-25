import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Link2, Accessibility, AlertCircle, Layers } from 'lucide-react'
import { DisabilityTypesTable } from '@/components/dashboard/admin/DisabilityTypesTable'
import { DisabilitySubtypesTable } from '@/components/dashboard/admin/DisabilitySubtypesTable'
import { AcessibilidadesTable } from '@/components/dashboard/admin/AcessibilidadesTable'
import BarriersManagementPage from './BarriersManagementPage'
import BarrierConnectionsPage from './BarrierConnectionsPage'

export default function SystemManagementPage() {
  const [activeTab, setActiveTab] = useState('disabilities')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 shadow-xl">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/10 blur-2xl" />
        
        <div className="relative p-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gerenciamento de Deficiências
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure tipos de deficiência, barreiras, acessibilidades e suas conexões
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger 
            value="disabilities" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg py-3"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </div>
            <span className="hidden sm:inline">Tipos de Deficiência</span>
            <span className="sm:hidden">Tipos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="subtypes" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg py-3"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="hidden sm:inline">Subtipos</span>
            <span className="sm:hidden">Subtipos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="barriers"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg py-3"
          >
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
            <span className="hidden sm:inline">Barreiras</span>
            <span className="sm:hidden">Barreiras</span>
          </TabsTrigger>
          <TabsTrigger 
            value="accessibility"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg py-3"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Accessibility className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="hidden sm:inline">Acessibilidades</span>
            <span className="sm:hidden">Acessib.</span>
          </TabsTrigger>
          <TabsTrigger 
            value="connections"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg py-3"
          >
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-violet-600" />
            </div>
            <span className="hidden sm:inline">Conexões</span>
            <span className="sm:hidden">Conexões</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disabilities" className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
            <div className="border-b bg-gradient-to-r from-blue-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                Tipos de Deficiência
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Gerencie os tipos de deficiência disponíveis na plataforma
              </p>
            </div>
            <div className="p-6">
              <DisabilityTypesTable />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subtypes" className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
            <div className="border-b bg-gradient-to-r from-indigo-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                Subtipos de Deficiência
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Gerencie os subtipos de deficiência e associe-os aos tipos principais
              </p>
            </div>
            <div className="p-6">
              <DisabilitySubtypesTable />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="barriers" className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
            <div className="border-b bg-gradient-to-r from-rose-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>
                Barreiras
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Configure as barreiras que podem ser enfrentadas por candidatos
              </p>
            </div>
            <div className="p-6">
              <BarriersManagementPage />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
            <div className="border-b bg-gradient-to-r from-emerald-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Accessibility className="h-5 w-5 text-emerald-600" />
                </div>
                Recursos de Acessibilidade
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Gerencie os recursos de acessibilidade que empresas podem oferecer
              </p>
            </div>
            <div className="p-6">
              <AcessibilidadesTable />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">
            <div className="border-b bg-gradient-to-r from-violet-500/5 to-transparent p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-violet-600" />
                </div>
                Conexões Barreira-Acessibilidade
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Configure quais recursos de acessibilidade atendem a cada barreira
              </p>
            </div>
            <div className="p-6">
              <BarrierConnectionsPage />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
