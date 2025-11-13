import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  SETORES_ATIVIDADE,
  ACESSIBILIDADES_OFERECIDAS,
} from '@/lib/schemas/company-signup-schema'
import { JOB_REGIMES } from '@/lib/schemas/job-posting-schema'
import { ListFilter, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Filters {
  sector: string
  city: string
  regime: string
  accessibilities: string[]
}

interface JobFiltersProps {
  filters: Filters
  onFilterChange: (key: string, value: string) => void
  onAccessibilityChange: (accessibility: string) => void
  onClearFilters: () => void
  uniqueCities: string[]
}

export const JobFilters = ({
  filters,
  onFilterChange,
  onAccessibilityChange,
  onClearFilters,
  uniqueCities,
}: JobFiltersProps) => {
  return (
    <div className="p-4 border rounded-lg bg-card space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="sector-filter">Setor</Label>
          <Select
            value={filters.sector}
            onValueChange={(v) => onFilterChange('sector', v)}
          >
            <SelectTrigger id="sector-filter">
              <SelectValue placeholder="Todos os setores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os setores</SelectItem>
              {SETORES_ATIVIDADE.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city-filter">Cidade</Label>
          <Select
            value={filters.city}
            onValueChange={(v) => onFilterChange('city', v === 'all' ? '' : v)}
          >
            <SelectTrigger id="city-filter">
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {uniqueCities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="regime-filter">Regime</Label>
          <Select
            value={filters.regime}
            onValueChange={(v) => onFilterChange('regime', v)}
          >
            <SelectTrigger id="regime-filter">
              <SelectValue placeholder="Todos os regimes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os regimes</SelectItem>
              {JOB_REGIMES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Acessibilidade</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
              >
                <ListFilter className="mr-2 h-4 w-4" />
                Selecionar
                {filters.accessibilities.length > 0 && (
                  <span className="ml-auto rounded-md bg-secondary px-2 py-0.5 text-xs">
                    {filters.accessibilities.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <ScrollArea className="h-60">
                <div className="p-4 space-y-2">
                  {ACESSIBILIDADES_OFERECIDAS.map((acc) => (
                    <div key={acc} className="flex items-center space-x-2">
                      <Checkbox
                        id={acc}
                        checked={filters.accessibilities.includes(acc)}
                        onCheckedChange={() => onAccessibilityChange(acc)}
                      />
                      <Label htmlFor={acc} className="font-normal">
                        {acc}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <div className="lg:col-span-full xl:col-span-1">
          <Button variant="ghost" className="w-full" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
