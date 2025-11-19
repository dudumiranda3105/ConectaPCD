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
import { ListFilter, X, MapPin, Briefcase, Clock, Accessibility } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

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
  const activeFiltersCount = 
    (filters.sector !== 'all' ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.regime !== 'all' ? 1 : 0) +
    filters.accessibilities.length

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg backdrop-blur-sm">
      {/* Elemento decorativo */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative p-6 space-y-5">
        {/* Header do filtro */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ListFilter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Filtrar Vagas</h3>
              <p className="text-xs text-muted-foreground">
                Refine sua busca para encontrar a vaga ideal
              </p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Setor */}
          <div className="space-y-2">
            <Label htmlFor="sector-filter" className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-primary" />
              Setor
            </Label>
            <Select
              value={filters.sector}
              onValueChange={(v) => onFilterChange('sector', v)}
            >
              <SelectTrigger id="sector-filter" className="h-11 border-border/50 bg-background/50 hover:bg-background transition-colors">
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

          {/* Cidade */}
          <div className="space-y-2">
            <Label htmlFor="city-filter" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Localização
            </Label>
            <Select
              value={filters.city || 'all'}
              onValueChange={(v) => onFilterChange('city', v === 'all' ? '' : v)}
            >
              <SelectTrigger id="city-filter" className="h-11 border-border/50 bg-background/50 hover:bg-background transition-colors">
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

          {/* Regime */}
          <div className="space-y-2">
            <Label htmlFor="regime-filter" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              Regime
            </Label>
            <Select
              value={filters.regime}
              onValueChange={(v) => onFilterChange('regime', v)}
            >
              <SelectTrigger id="regime-filter" className="h-11 border-border/50 bg-background/50 hover:bg-background transition-colors">
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

          {/* Acessibilidade */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Accessibility className="h-4 w-4 text-primary" />
              Acessibilidade
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start font-normal border-border/50 bg-background/50 hover:bg-background transition-colors"
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  Selecionar recursos
                  {filters.accessibilities.length > 0 && (
                    <Badge variant="secondary" className="ml-auto px-2 py-0.5 text-xs font-semibold">
                      {filters.accessibilities.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <div className="border-b bg-muted/50 px-4 py-3">
                  <h4 className="font-semibold text-sm">Recursos de Acessibilidade</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Selecione os recursos necessários
                  </p>
                </div>
                <ScrollArea className="h-64">
                  <div className="p-4 space-y-3">
                    {ACESSIBILIDADES_OFERECIDAS.map((acc) => (
                      <div key={acc} className="flex items-start space-x-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={acc}
                          checked={filters.accessibilities.includes(acc)}
                          onCheckedChange={() => onAccessibilityChange(acc)}
                          className="mt-0.5"
                        />
                        <Label 
                          htmlFor={acc} 
                          className="font-normal text-sm leading-relaxed cursor-pointer flex-1"
                        >
                          {acc}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Botão limpar filtros */}
        {activeFiltersCount > 0 && (
          <div className="flex justify-end pt-2 border-t border-border/50">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar todos os filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
