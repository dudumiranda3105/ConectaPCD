import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Link2, Unlink2, Accessibility, Sparkles, Shield } from 'lucide-react';
import { acessibilidadesService, Acessibilidade, Barreira } from '@/services/acessibilidades';
import { getBarreiras } from '@/services/barreiras';
import { toast } from '@/hooks/use-toast';

export function AcessibilidadesTable() {
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [loading, setLoading] = useState(false);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [selectedAcessibilidadeId, setSelectedAcessibilidadeId] = useState<number | null>(null);
  const [selectedBarreirasIds, setSelectedBarreirasIds] = useState<number[]>([]);

  useEffect(() => {
    fetchAcessibilidades();
    fetchBarreiras();
  }, []);

  const fetchAcessibilidades = async () => {
    try {
      setLoading(true);
      const data = await acessibilidadesService.list();
      setAcessibilidades(data);
    } catch (error) {
      console.error('Erro ao carregar acessibilidades:', error);
      toast({ title: 'Erro', description: 'Não foi possível carregar as acessibilidades' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBarreiras = async () => {
    try {
      const data = await getBarreiras();
      setBarreiras(data);
    } catch (error) {
      console.error('Erro ao carregar barreiras:', error);
    }
  };

  const handleCreateAcessibilidade = async () => {
    if (!novaDescricao.trim()) {
      toast({ title: 'Erro', description: 'Digite uma descrição para a acessibilidade' });
      return;
    }

    try {
      setLoading(true);
      await acessibilidadesService.create(novaDescricao.trim());
      setNovaDescricao('');
      await fetchAcessibilidades();
      toast({ title: 'Sucesso', description: 'Acessibilidade criada com sucesso' });
    } catch (error: any) {
      console.error('Erro ao criar acessibilidade:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao criar acessibilidade' });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBarreira = async (acessibilidadeId: number, barreiraId: number) => {
    try {
      setLoading(true);
      await acessibilidadesService.connectBarreira(acessibilidadeId, barreiraId);
      await fetchAcessibilidades();
      toast({ title: 'Sucesso', description: 'Barreira conectada com sucesso' });
    } catch (error: any) {
      console.error('Erro ao conectar barreira:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao conectar barreira' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectBarreira = async (acessibilidadeId: number, barreiraId: number) => {
    try {
      setLoading(true);
      await acessibilidadesService.disconnectBarreira(acessibilidadeId, barreiraId);
      await fetchAcessibilidades();
      toast({ title: 'Sucesso', description: 'Barreira desconectada com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar barreira:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao desconectar barreira' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Acessibilidades</h2>
          <p className="text-sm text-muted-foreground">Gerencie as acessibilidades oferecidas pelas empresas</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg gap-2">
              <Plus className="w-4 h-4" />
              Nova Acessibilidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Accessibility className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Criar Nova Acessibilidade</DialogTitle>
                  <DialogDescription className="text-base">Adicione uma nova acessibilidade ao sistema</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  Descrição da Acessibilidade
                </label>
                <Input
                  placeholder="Ex: Rampas de acesso para cadeirantes"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  disabled={loading}
                  className="h-12 border-2 focus:border-emerald-500 transition-all"
                />
                <p className="text-xs text-muted-foreground">
                  Descreva claramente o recurso de acessibilidade oferecido
                </p>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setNovaDescricao('')} 
                  disabled={loading}
                  className="h-10 px-6"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateAcessibilidade} 
                  disabled={loading}
                  className="h-10 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                >
                  {loading ? 'Criando...' : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-emerald-500/5 to-transparent border-b">
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="font-semibold w-32">Barreiras</TableHead>
              <TableHead className="font-semibold w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && acessibilidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Carregando acessibilidades...
                </TableCell>
              </TableRow>
            ) : acessibilidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Nenhuma acessibilidade cadastrada
                </TableCell>
              </TableRow>
            ) : (
              acessibilidades.map((acess) => (
                <TableRow key={acess.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Accessibility className="h-4 w-4 text-emerald-600" />
                      </div>
                      {acess.descricao}
                    </div>
                  </TableCell>
                  <TableCell>
                    {acess.barreiras && acess.barreiras.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-xs">{acess.barreiras.length}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {acess.barreiras.length === 1 ? 'barreira' : 'barreiras'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Nenhuma</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all"
                            onClick={() => {
                              setSelectedAcessibilidadeId(acess.id);
                              setSelectedBarreirasIds(acess.barreiras?.map(b => b.barreira.id) || []);
                            }}
                          >
                            <Link2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Conectar Barreiras</span>
                            <span className="sm:hidden">Barreiras</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                          <DialogHeader className="space-y-3 pb-4 border-b">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                <Link2 className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <DialogTitle className="text-2xl">Conectar Barreiras</DialogTitle>
                                <DialogDescription className="text-base mt-1">
                                  Selecione as barreiras que <strong className="text-emerald-600">{acess.descricao}</strong> resolve
                                </DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>
                          
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 mt-4 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent hover:scrollbar-thumb-emerald-500/40 scrollbar-thumb-rounded-full">
                            {barreiras.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Nenhuma barreira cadastrada</p>
                                <p className="text-sm mt-1">Cadastre barreiras primeiro para poder conectá-las</p>
                              </div>
                            ) : (
                              <>
                                <div className="sticky top-0 bg-background pb-3 flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">
                                    {acess.barreiras?.length || 0} de {barreiras.length} barreiras conectadas
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <div className="h-3 w-3 rounded bg-emerald-100 border-2 border-emerald-300"></div>
                                      <span>Conectada</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <div className="h-3 w-3 rounded bg-white border-2 border-gray-200"></div>
                                      <span>Disponível</span>
                                    </div>
                                  </div>
                                </div>
                                {barreiras.map((barreira) => {
                                  const isConnected = acess.barreiras?.some(b => b.barreira.id === barreira.id);
                                  return (
                                    <div
                                      key={barreira.id}
                                      className={`group flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200 ${
                                        isConnected 
                                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-700 shadow-md scale-[1.02]' 
                                          : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/30 hover:scale-[1.01]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${
                                          isConnected 
                                            ? 'bg-emerald-500/20 text-emerald-700' 
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                                        }`}>
                                          <Shield className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                          <span className="text-sm font-medium block">{barreira.descricao}</span>
                                          {isConnected && (
                                            <span className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                              Conectada
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant={isConnected ? 'outline' : 'default'}
                                        onClick={() =>
                                          isConnected
                                            ? handleDisconnectBarreira(acess.id, barreira.id)
                                            : handleConnectBarreira(acess.id, barreira.id)
                                        }
                                        disabled={loading}
                                        className={`ml-3 transition-all ${
                                          isConnected 
                                            ? 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30' 
                                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md'
                                        }`}
                                      >
                                        {isConnected ? (
                                          <>
                                            <Unlink2 className="w-4 h-4 mr-1" />
                                            Desconectar
                                          </>
                                        ) : (
                                          <>
                                            <Link2 className="w-4 h-4 mr-1" />
                                            Conectar
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
