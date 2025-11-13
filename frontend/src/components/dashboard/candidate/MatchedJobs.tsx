import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/providers/AuthProvider'
import { Job } from '@/lib/jobs'
import { JobCard } from '@/components/dashboard/candidate/JobCard'
import { JobCardSkeleton } from '@/components/dashboard/candidate/JobCardSkeleton'
import { useJobStore } from '@/stores/job-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const MatchedJobs = () => {
  const { user } = useAuth() as { user: User | null }
  const { jobs } = useJobStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const calculateMatchScore = useCallback(
    (job: Job) => {
      const candidateDisabilities = user?.profileData?.disabilities || []
      if (candidateDisabilities.length === 0) return 100

      const requiredAccessibilities = new Set<string>()

      candidateDisabilities.forEach((disability) => {
        if (disability.typeId === 3) {
          requiredAccessibilities.add('Rampas de acesso')
          requiredAccessibilities.add('Mobiliário adaptado')
        }
        if (disability.typeId === 1) {
          requiredAccessibilities.add('Software de leitura de tela')
        }
        if (disability.typeId === 2) {
          requiredAccessibilities.add('Intérprete de Libras')
        }
      })

      if (requiredAccessibilities.size === 0) return 100

      const offered = job.accessibilities
      const matches = Array.from(requiredAccessibilities).filter((req) =>
        offered.includes(req as any),
      ).length

      const score = Math.round((matches / requiredAccessibilities.size) * 100)
      return isNaN(score) ? 100 : score
    },
    [user],
  )

  const matchedJobs = useMemo(() => {
    return jobs
      .filter((job) => job.status === 'Ativa')
      .map((job) => ({
        job,
        score: calculateMatchScore(job),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [jobs, calculateMatchScore])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vagas Recomendadas para Você</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          ) : matchedJobs.length > 0 ? (
            matchedJobs.map(({ job, score }) => (
              <JobCard
                key={job.id}
                job={job}
                matchScore={score}
                showIcons={false}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-secondary rounded-lg">
              <h3 className="text-xl font-semibold">
                Nenhuma vaga recomendada encontrada
              </h3>
              <p className="text-muted-foreground mt-2">
                Continue explorando as vagas disponíveis na plataforma.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
