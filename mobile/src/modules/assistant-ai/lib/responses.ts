// Simple rule-based assistant responses (placeholder for future AI integration)
export function generateAssistantResponse(userText: string): string {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("véhicule") && lowerText.includes("combien")) {
        return "Aujourd'hui, 127 véhicules ont été débarqués. Répartition :\n• Toyota : 34 véhicules\n• BMW : 28 véhicules\n• Mercedes : 25 véhicules\n• Autres : 40 véhicules";
    }

    if (lowerText.includes("zone") && lowerText.includes("capacité")) {
        return "Capacité des zones :\n🟢 Zone A : 75% (225/300)\n🟡 Zone B : 85% (170/200)\n🔴 Zone C : 95% (190/200)\n\nLa zone C est presque pleine.";
    }

    if (lowerText.includes("scanner") || lowerText.includes("qr")) {
        return 'Pour scanner un code QR :\n1. Allez dans l\'onglet Scanner\n2. Sélectionnez le port-call\n3. Appuyez sur "Démarrer le scan"\n4. Pointez vers le code';
    }

    if (lowerText.includes("aide") || lowerText.includes("help")) {
        return "Je peux vous aider avec :\n• Statut des véhicules\n• Capacité des zones\n• Guide d'utilisation\n• Localisation de véhicules\n• Génération de rapports";
    }

    return "Je comprends votre demande. Voici ce que je peux faire :\n• Vérifier le statut des véhicules\n• Consulter la capacité des zones\n• Vous guider dans l'application\n• Répondre à vos questions";
}
