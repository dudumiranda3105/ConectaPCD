import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DisabilityTypesTable } from '@/components/dashboard/admin/DisabilityTypesTable'
import { DisabilitySubtypesTable } from '@/components/dashboard/admin/DisabilitySubtypesTable'

export default function DisabilityManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar Deficiências</h1>
      <p className="text-muted-foreground">
        Adicione, edite ou remova os tipos e subtipos de deficiências que os
        candidatos podem selecionar.
      </p>
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="types">Tipos de Deficiência</TabsTrigger>
          <TabsTrigger value="subtypes">Subtipos de Deficiência</TabsTrigger>
        </TabsList>
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Deficiência</CardTitle>
              <CardDescription>
                Gerencie as categorias principais de deficiências.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DisabilityTypesTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subtypes">
          <Card>
            <CardHeader>
              <CardTitle>Subtipos de Deficiência</CardTitle>
              <CardDescription>
                Gerencie os subtipos e associe-os a uma categoria principal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DisabilitySubtypesTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
