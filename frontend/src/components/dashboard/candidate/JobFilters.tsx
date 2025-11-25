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
} from '@/lib/schemas/company-signup-schema'
import { JOB_REGIMES } from '@/lib/schemas/job-posting-schema'
import { ListFilter, X, MapPin, Briefcase, Clock, Accessibility, ChevronDown, Sparkles, Search, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Acessibilidade } from '@/services/acessibilidades'

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
  acessibilidades: Acessibilidade[]
  loadingAcessibilidades?: boolean
}

export const JobFilters = ({
  filters,
  onFilterChange,
  onAccessibilityChange,
  onClearFilters,
  uniqueCities,
  acessibilidades,
  loadingAcessibilidades = false,
}: JobFiltersProps) => {
  const activeFiltersCount = 
    (filters.sector !== 'all' ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.regime !== 'all' ? 1 : 0) +
    filters.accessibilities.length

  return (
    <div className="space-y-4">
      {/* Grid de filtros compacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Setor */}
        <div className="group">
          <Select
            value={filters.sector}
            onValueChange={(v) => onFilterChange('sector', v)}
          >
            <SelectTrigger className="h-14 rounded-xl border-2 border-border/50 bg-background hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group-hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Setor</span>
                  <SelectValue placeholder="Todos" className="text-sm font-medium" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              <SelectItem value="all" className="rounded-lg">Todos os setores</SelectItem>
              {SETORES_ATIVIDADE.map((s) => (
                <SelectItem key={s} value={s} className="rounded-lg">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cidade */}
        <div className="group">
          <Select
            value={filters.city || 'all'}
            onValueChange={(v) => onFilterChange('city', v === 'all' ? '' : v)}
          >
            <SelectTrigger className="h-14 rounded-xl border-2 border-border/50 bg-background hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group-hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Localização</span>
                  <SelectValue placeholder="Todas" className="text-sm font-medium" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              <SelectItem value="all" className="rounded-lg">Todas as cidades</SelectItem>
              {uniqueCities.map((c) => (
                <SelectItem key={c} value={c} className="rounded-lg">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Regime */}
        <div className="group">
          <Select
            value={filters.regime}
            onValueChange={(v) => onFilterChange('regime', v)}
          >
            <SelectTrigger className="h-14 rounded-xl border-2 border-border/50 bg-background hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group-hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Regime</span>
                  <SelectValue placeholder="Todos" className="text-sm font-medium" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              <SelectItem value="all" className="rounded-lg">Todos os regimes</SelectItem>
              {JOB_REGIMES.map((r) => (
                <SelectItem key={r} value={r} className="rounded-lg">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Acessibilidade */}
        <div className="group">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-14 justify-start rounded-xl border-2 border-border/50 bg-background hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group-hover:shadow-md px-3"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Accessibility className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Acessibilidade</span>
                    <span className="text-sm font-medium truncate">
                      {filters.accessibilities.length > 0 
                        ? `${filters.accessibilities.length} selecionado${filters.accessibilities.length > 1 ? 's' : ''}`
                        : 'Selecionar'}
                    </span>
                  </div>
                  {filters.accessibilities.length > 0 && (
                    <Badge className="bg-emerald-500 text-white border-0 h-6 w-6 p-0 flex items-center justify-center rounded-full text-xs font-bold">
                      {filters.accessibilities.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-xl border-2 shadow-xl" align="start">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 rounded-t-xl">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  Recursos de Acessibilidade
                </h4>
                <p className="text-xs text-white/80 mt-0.5">
                  Selecione os recursos que você precisa
                </p>
              </div>
              <ScrollArea className="h-72">
                <div className="p-3 space-y-1">
                  {loadingAcessibilidades ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                      <span className="ml-2 text-sm text-muted-foreground">Carregando...</span>
                    </div>
                  ) : acessibilidades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Accessibility className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">Nenhuma acessibilidade cadastrada</p>
                    </div>
                  ) : (
                    acessibilidades.map((acc) => (
                      <div 
                        key={acc.id} 
                        className={`flex items-center space-x-3 rounded-xl p-3 cursor-pointer transition-all ${
                          filters.accessibilities.includes(acc.descricao)
                            ? 'bg-emerald-500/10 border-2 border-emerald-500/30'
                            : 'hover:bg-muted/50 border-2 border-transparent'
                        }`}
                        onClick={() => onAccessibilityChange(acc.descricao)}
                      >
                        <Checkbox
                          id={`acc-${acc.id}`}
                          checked={filters.accessibilities.includes(acc.descricao)}
                          onCheckedChange={() => onAccessibilityChange(acc.descricao)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label 
                          htmlFor={`acc-${acc.id}`} 
                          className="font-medium text-sm leading-relaxed cursor-pointer flex-1"
                        >
                          {acc.descricao}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              {filters.accessibilities.length > 0 && (
                <div className="border-t p-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-muted-foreground hover:text-foreground"
                    onClick={() => filters.accessibilities.forEach(a => onAccessibilityChange(a))}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar seleção
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Badges de filtros ativos e botão limpar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          
          {filters.sector !== 'all' && (
            <Badge 
              variant="secondary" 
              className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 gap-1.5 pr-1.5 hover:bg-indigo-500/20 cursor-pointer"
              onClick={() => onFilterChange('sector', 'all')}
            >
              <Briefcase className="h-3 w-3" />
              {filters.sector}
              <X className="h-3 w-3 ml-1 hover:text-indigo-900" />
            </Badge>
          )}
          
          {filters.city && (
            <Badge 
              variant="secondary" 
              className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 gap-1.5 pr-1.5 hover:bg-blue-500/20 cursor-pointer"
              onClick={() => onFilterChange('city', '')}
            >
              <MapPin className="h-3 w-3" />
              {filters.city}
              <X className="h-3 w-3 ml-1 hover:text-blue-900" />
            </Badge>
          )}
          
          {filters.regime !== 'all' && (
            <Badge 
              variant="secondary" 
              className="bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20 gap-1.5 pr-1.5 hover:bg-violet-500/20 cursor-pointer"
              onClick={() => onFilterChange('regime', 'all')}
            >
              <Clock className="h-3 w-3" />
              {filters.regime}
              <X className="h-3 w-3 ml-1 hover:text-violet-900" />
            </Badge>
          )}
          
          {filters.accessibilities.map(acc => (
            <Badge 
              key={acc}
              variant="secondary" 
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 gap-1.5 pr-1.5 hover:bg-emerald-500/20 cursor-pointer max-w-[200px]"
              onClick={() => onAccessibilityChange(acc)}
            >
              <Accessibility className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{acc}</span>
              <X className="h-3 w-3 ml-1 flex-shrink-0 hover:text-emerald-900" />
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-destructive h-7 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  )
}
