import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DisabilityTypesWithSubtypesTable } from '@/components/dashboard/admin/DisabilityTypesWithSubtypesTable'
import { DisabilitySubtypesTable } from '@/components/dashboard/admin/DisabilitySubtypesTable'
import { Accessibility, Layers, FolderTree, Search, Loader2, Shield, Link2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getDisabilityTypes, getSubtypes } from '@/services/disabilities'
import { getBarreiras } from '@/services/barreiras'
import BarriersManagementPage from './BarriersManagementPage'
import BarrierConnectionsPage from './BarrierConnectionsPage'

export default function DisabilityManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({ types: 0, subtypes: 0, barriers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [types, subtypes, barriers] = await Promise.all([
          getDisabilityTypes(),
          getSubtypes(),
          getBarreiras(),
        ])
        setStats({
          types: types.length,
          subtypes: subtypes.length,
          barriers: barriers.length,
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <Accessibility className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Gerenciar Deficiências
                </h1>
                <p className="text-white/70 mt-1">
                  Adicione, edite ou remova os tipos e subtipos de deficiências
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-2 border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipos de Deficiência</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                ) : (
                  <p className="text-3xl font-bold text-teal-600">{stats.types}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <FolderTree className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subtipos Cadastrados</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                ) : (
                  <p className="text-3xl font-bold text-emerald-600">{stats.subtypes}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barreiras Cadastradas</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                ) : (
                  <p className="text-3xl font-bold text-rose-600">{stats.barriers}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Card */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500" />
        <CardContent className="p-6">
          <Tabs defaultValue="types" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger 
                value="types" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Layers className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tipos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="create-subtypes"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <FolderTree className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Subtipos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="barriers"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Barreiras</span>
              </TabsTrigger>
              <TabsTrigger 
                value="connections"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Link2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Conexões</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="types" className="mt-0">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Tipos de Deficiência</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerencie as categorias principais de deficiências e seus subtipos.
                    </p>
                  </div>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tipo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <DisabilityTypesWithSubtypesTable searchTerm={searchTerm} />
              </div>
            </TabsContent>
            
            <TabsContent value="create-subtypes" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Criar Subtipos de Deficiência</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie novos subtipos e associe-os a uma categoria principal.
                  </p>
                </div>
                <DisabilitySubtypesTable />
              </div>
            </TabsContent>

            <TabsContent value="barriers" className="mt-0">
              <BarriersManagementPage />
            </TabsContent>

            <TabsContent value="connections" className="mt-0">
              <BarrierConnectionsPage />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
