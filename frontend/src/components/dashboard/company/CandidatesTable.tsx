import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

type CandidateStatus = 'Pendente' | 'Revisado' | 'Entrevistando' | 'Rejeitado' | 'Contratado'

type Candidate = {
  id: string
  name: string
  email: string
  appliedDate: string
  matchScore: number
  disabilities: string[]
  status: CandidateStatus
}

interface CandidatesTableProps {
  candidates: Candidate[]
}

export const CandidatesTable = ({ candidates }: CandidatesTableProps) => {
  const getStatusVariant = (
    status: CandidateStatus,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Contratado':
        return 'default'
      case 'Entrevistando':
        return 'default'
      case 'Revisado':
        return 'secondary'
      case 'Rejeitado':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidato</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Data da Candidatura</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{candidate.matchScore}%</Badge>
              </TableCell>
              <TableCell>
                {new Date(candidate.appliedDate).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(candidate.status)}>
                  {candidate.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Ver Perfil Completo</DropdownMenuItem>
                    <DropdownMenuItem>Mover para Entrevista</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Rejeitar Candidato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
