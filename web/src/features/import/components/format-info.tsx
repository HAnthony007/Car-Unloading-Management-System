import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function FormatInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Format Excel attendu (Manifeste)</CardTitle>
        <CardDescription>
          Feuilles requises: « Navire » et « Véhicules ». La feuille « Douanes » est ignorée.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feuille Navire */}
        <div className="space-y-3">
          <div className="font-semibold">Feuille « Navire »</div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium mb-2">Format Clé/Valeur (2 colonnes)</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Nom du navire → ex: MV ASIA EXPRESS</li>
                <li>Numéro IMO → ex: 9334567</li>
                <li>Pavillon → ex: Panama</li>
                <li>Agent maritime → ex: SMMC</li>
                <li>Port de provenance → ex: Japon</li>
                <li>ETA → ex: 2025-08-25 10:30</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium mb-2">Format Colonnes (en-têtes sur une ligne)</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">nom_du_navire</Badge>
                <Badge variant="outline">numero_imo</Badge>
                <Badge variant="outline">pavillon</Badge>
                <Badge variant="outline">agent_maritime</Badge>
                <Badge variant="outline">port_de_provenance</Badge>
                <Badge variant="outline">eta</Badge>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Un Vessel est créé/trouvé par son IMO. Un PortCall est créé avec agent, port d'origine et ETA (dock_id nul).
          </p>
        </div>

        <Separator />

        {/* Feuille Véhicules */}
        <div className="space-y-3">
          <div className="font-semibold">Feuille « Véhicules »</div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-sm font-medium">Champs obligatoires et alias</div>
              <div className="text-sm text-muted-foreground">VIN / Châssis</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">vin</Badge>
                <Badge variant="outline">vin___chassis</Badge>
                <Badge variant="outline">vin/chassis</Badge>
                <Badge variant="outline">chassis</Badge>
              </div>
              <div className="text-sm text-muted-foreground pt-2">Connaissement B/L (unique)</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">connaissement_b_l</Badge>
                <Badge variant="outline">connaissement</Badge>
                <Badge variant="outline">bill_of_lading</Badge>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-sm font-medium">Autres colonnes supportées (alias)</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="mb-1">Marque</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">marque</Badge>
                    <Badge variant="outline">make</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Modèle</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">modele</Badge>
                    <Badge variant="outline">modèle</Badge>
                    <Badge variant="outline">model</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Type</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">type</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Couleur</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">couleur</Badge>
                    <Badge variant="outline">color</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Année</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">annee</Badge>
                    <Badge variant="outline">année</Badge>
                    <Badge variant="outline">year</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Pays origine</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">pays_origine</Badge>
                    <Badge variant="outline">pays_origin</Badge>
                    <Badge variant="outline">pays</Badge>
                    <Badge variant="outline">origin_country</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Propriétaire/Destinataire</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">proprietaire_destinataire</Badge>
                    <Badge variant="outline">propriétaire_destinataire</Badge>
                    <Badge variant="outline">owner</Badge>
                    <Badge variant="outline">proprietaire</Badge>
                    <Badge variant="outline">owner_name</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Emplacement navire</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">emplacement_navire</Badge>
                    <Badge variant="outline">ship_location</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Statut</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">statut</Badge>
                    <Badge variant="outline">status</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Observations</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">observations</Badge>
                    <Badge variant="outline">observation</Badge>
                    <Badge variant="outline">vehicle_observation</Badge>
                  </div>
                </div>
                <div>
                  <div className="mb-1">Amorce (booléen)</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">amorce</Badge>
                    <Badge variant="outline">is_primed</Badge>
                  </div>
                  <div className="text-muted-foreground mt-1">Valeurs: oui/non, true/false, 1/0</div>
                </div>
                <div>
                  <div className="mb-1">Poids brut (kg)</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">poids_brut__kg_</Badge>
                    <Badge variant="outline">poids_brut_kg</Badge>
                    <Badge variant="outline">poids</Badge>
                    <Badge variant="outline">weight</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Un véhicule est unique par VIN (doublons ignorés). Un dossier (FollowUpFile) est créé avec un B/L (obligatoire, unique) et lié au PortCall créé depuis la feuille Navire.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
