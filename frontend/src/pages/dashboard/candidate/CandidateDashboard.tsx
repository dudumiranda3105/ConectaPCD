import { useState, useMemo, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/providers/AuthProvider'
import { Job } from '@/lib/jobs'
import { JobCard } from '@/components/dashboard/candidate/JobCard'
import { JobFilters } from '@/components/dashboard/candidate/JobFilters'
import { JobCardSkeleton } from '@/components/dashboard/candidate/JobCardSkeleton'
import { useJobStore } from '@/stores/job-store'
import { listarVagasPublicas } from '@/services/vagas'
import { listarCandidaturasCandidato } from '@/services/candidaturas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Sparkles, CheckCircle2 } from 'lucide-react'

export default function CandidateDashboard() {
  const { user } = useAuth() as { user: User | null }
  const { jobs, setJobs } = useJobStore()
  const [loading, setLoading] = useState(true)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    sector: 'all',
    city: '',
    regime: 'all',
    accessibilities: [] as string[],
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const vagas = await listarVagasPublicas()
        console.log('[CandidateDashboard] Vagas recebidas do backend:', vagas)
        // Mapear vagas do backend para o tipo Job usado no frontend
        const mapped: Job[] = vagas.map((v: any) => {
          const cd = v.empresa?.companyData || {}
          const cidade = cd.cidade || cd.localidade || ''
          const estado = cd.estado || cd.uf || ''
          const location = [cidade, estado].filter(Boolean).join(' - ') || 'Brasil'
          const setor = cd.setorAtividade || 'Tecnologia'
          const status = v.isActive ? 'Ativa' : 'Fechada'
          console.log('[CandidateDashboard] Mapeando vaga:', { id: v.id, titulo: v.titulo, isActive: v.isActive, status, empresa: v.empresa })
          return {
            id: String(v.id),
            title: v.titulo || 'Sem título',
            description: v.descricao || '',
            company: v.empresa?.nome || 'Empresa',
            logo: 'https://img.usecurling.com/i?q=company&color=blue',
            location,
            sector: setor,
            regime: v.regimeTrabalho || 'Presencial',
            type: v.tipo || 'Tempo integral',
            accessibilities: v.acessibilidades?.map((a: any) => a.acessibilidade?.descricao).filter(Boolean) || [],
            status,
            applications: 0,
            createdAt: v.createdAt || new Date().toISOString(),
            benefits: v.beneficios || '',
          }
        })
        console.log('[CandidateDashboard] Jobs mapeados:', mapped)
        setJobs(mapped)
      } catch (e) {
        console.error('[CandidateDashboard] Erro ao buscar vagas:', e)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [setJobs])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.candidatoId) return
      
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return
        
        const candidaturas = await listarCandidaturasCandidato(user.candidatoId, token)
        const appliedJobIds = new Set<string>(candidaturas.map((c: any) => String(c.vaga.id)))
        setAppliedJobs(appliedJobIds)
      } catch (error) {
        console.error('Erro ao buscar candidaturas:', error)
        // Se der erro, continua sem candidaturas aplicadas
        setAppliedJobs(new Set())
      }
    }
    
    fetchApplications()
  }, [user?.candidatoId])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleAccessibilityChange = (accessibility: string) => {
    setFilters((prev) => {
      const newAccessibilities = prev.accessibilities.includes(accessibility)
        ? prev.accessibilities.filter((a) => a !== accessibility)
        : [...prev.accessibilities, accessibility]
      return { ...prev, accessibilities: newAccessibilities }
    })
  }

  const clearFilters = () => {
    setFilters({
      sector: 'all',
      city: '',
      regime: 'all',
      accessibilities: [],
    })
  }

  const uniqueCities = [...new Set(jobs.map((job) => job.location))]

  const filteredJobs = useMemo(() => {
    console.log('[CandidateDashboard] Filtrando jobs. Total:', jobs.length, 'Filtros:', filters)
    const result = jobs.filter((job) => {
      console.log('[CandidateDashboard] Verificando job:', job.id, job.title, 'Status:', job.status)
      if (job.status !== 'Ativa') return false
      if (filters.sector !== 'all' && job.sector !== filters.sector)
        return false
      if (
        filters.city &&
        !job.location.toLowerCase().includes(filters.city.toLowerCase())
      )
        return false
      if (filters.regime !== 'all' && job.regime !== filters.regime)
        return false
      if (
        filters.accessibilities.length > 0 &&
        !filters.accessibilities.every((acc) =>
          job.accessibilities.includes(acc as any),
        )
      )
        return false
      return true
    })
    console.log('[CandidateDashboard] Jobs após filtro:', result.length)
    return result
  }, [filters, jobs])

  const calculateMatchScore = useCallback(
    (job: Job) => {
      try {
        const candidateDisabilities = user?.profileData?.disabilities || []
        if (candidateDisabilities.length === 0) return 85

        const requiredAccessibilities = new Set<string>()

        // This is a simplified logic. A real-world scenario would be more complex.
        candidateDisabilities.forEach((disability) => {
          if (disability?.typeId === 3) {
            // Física/Motora
            requiredAccessibilities.add('Rampas de acesso')
            requiredAccessibilities.add('Mobiliário adaptado')
          }
          if (disability?.typeId === 1) {
            // Visual
            requiredAccessibilities.add('Software de leitura de tela')
          }
        })

        if (requiredAccessibilities.size === 0) return 85
      } catch (error) {
        console.error('Erro ao calcular match score:', error)
        return 75
      }

        // Simple scoring based on job data
        let score = 60 // Base score
        
        if (job.accessibilities && job.accessibilities.length > 0) {
          score += 20 // Bonus for having accessibilities
        }
        
        if (job.sector && job.sector.toLowerCase() === 'tecnologia') {
          score += 10 // Bonus for tech sector
        }
        
        return Math.min(score, 95) // Max 95% to be realistic
    },
    [user],
  )



  return (
    <div className="space-y-6">
      {/* Header aprimorado com saudação e estatísticas */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-2xl shadow-indigo-500/20">
        {/* Elementos decorativos de fundo */}
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-pink-400/10 blur-2xl" />
        
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col gap-8">
            {/* Saudação e descrição */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
                    Olá, {user?.name?.split(' ')[0] || 'Candidato'}! 👋
                  </h1>
                  <p className="mt-1 text-base text-indigo-100/90">
                    {loading
                      ? 'Buscando as melhores oportunidades para você...'
                      : `Encontramos ${filteredJobs.length} vaga${filteredJobs.length === 1 ? '' : 's'} perfeita${filteredJobs.length === 1 ? '' : 's'} para seu perfil`}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  ✨ Inclusão em primeiro lugar
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-300/30 hover:bg-emerald-500/30 backdrop-blur-sm">
                  🎯 Vagas compatíveis
                </Badge>
              </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all hover:bg-white/15 hover:scale-105 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl transition-all group-hover:bg-indigo-400/30" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-100/80 mb-1">Vagas Disponíveis</p>
                    <p className="text-3xl font-bold text-white">
                      {jobs.filter((j) => j.status === 'Ativa').length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all hover:bg-white/15 hover:scale-105 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-pink-400/20 blur-2xl transition-all group-hover:bg-pink-400/30" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-100/80 mb-1">Para Você</p>
                    <p className="text-3xl font-bold text-white">{filteredJobs.length}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all hover:bg-white/15 hover:scale-105 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl transition-all group-hover:bg-emerald-400/30" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-100/80 mb-1">Candidaturas</p>
                    <p className="text-3xl font-bold text-white">{appliedJobs.size}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Recomendações para você</h2>
          <p className="text-sm text-muted-foreground">Filtre por cidade, setor, regime ou acessibilidade oferecida.</p>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Atualizar sugestões
        </Button>
      </div>
      <JobFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onAccessibilityChange={handleAccessibilityChange}
        onClearFilters={clearFilters}
        uniqueCities={uniqueCities}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => {
            try {
              return (
                <JobCard
                  key={job.id || index}
                  job={job}
                  matchScore={calculateMatchScore(job)}
                  isApplied={appliedJobs.has(job.id)}
                />
              )
            } catch (error) {
              console.error('Erro ao renderizar JobCard:', error, job)
              return <div key={index} className="p-4 bg-red-100 rounded">Erro ao carregar vaga</div>
            }
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-card rounded-lg">
            <h3 className="text-xl font-semibold">Nenhuma vaga encontrada</h3>
            <p className="text-muted-foreground mt-2">
              Tente ajustar seus filtros ou verifique novamente mais tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
