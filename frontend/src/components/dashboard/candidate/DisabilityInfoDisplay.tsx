import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getDisabilityTypes,
  getSubtypes,
  getBarriers,
  DisabilityType,
  DisabilitySubtype,
  Barrier,
} from '@/services/disabilities'
import { DisabilityInfoValues } from '@/lib/schemas/candidate-signup-schema'

interface DisabilityInfoDisplayProps {
  disabilities: DisabilityInfoValues['disabilities']
}

export const DisabilityInfoDisplay = ({
  disabilities,
}: DisabilityInfoDisplayProps) => {
  const [typeMap, setTypeMap] = useState<Map<number, string>>(new Map())
  const [subtypeMap, setSubtypeMap] = useState<Map<number, string>>(new Map())
  const [barrierMap, setBarrierMap] = useState<Map<number, string>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, subtypes, barriers] = await Promise.all([
          getDisabilityTypes(),
          getSubtypes(),
          getBarriers(),
        ])
        setTypeMap(new Map(types.map((t: DisabilityType) => [t.id, t.nome])))
        setSubtypeMap(
          new Map(subtypes.map((s: DisabilitySubtype) => [s.id, s.nome])),
        )
        setBarrierMap(
          new Map(barriers.map((b: Barrier) => [b.id, b.descricao])),
        )
      } catch (error) {
        console.error('Failed to fetch disability data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!disabilities || disabilities.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhuma informação de deficiência cadastrada.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {disabilities.map((disability) => (
        <Card key={disability.typeId}>
          <CardHeader>
            <CardTitle>{typeMap.get(disability.typeId) || '...'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {disability.subtypes.map((subtype) => (
              <div key={subtype.subtypeId}>
                <h4 className="font-semibold">
                  {subtypeMap.get(subtype.subtypeId) || '...'}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subtype.barriers.length > 0 ? (
                    subtype.barriers.map((barrierId) => (
                      <Badge key={barrierId} variant="secondary">
                        {barrierMap.get(barrierId) || '...'}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma barreira informada.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
