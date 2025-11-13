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
      <h1 className="text-3xl font-bold">Vagas para você</h1>
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
