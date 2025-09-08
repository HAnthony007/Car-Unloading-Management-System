import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const handleLogout = () => {
    const router = useRouter();
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => router.replace('/login')
        }
      ]
    );
}