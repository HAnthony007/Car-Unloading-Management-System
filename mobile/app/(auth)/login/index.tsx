import { StyledButton } from '@/components/ui/StyledButton';
import { StyledTextInput } from '@/components/ui/StyledTextInput';
import { useAuth } from '@/providers/AuthProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
  // TODO: Replace with real API call then set user
  await new Promise((res) => setTimeout(res, 600));
  await login(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError("Impossible de se connecter. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const isValid = email.trim().length > 0 && password.length >= 6;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6">
          <View className="items-center mt-8">
            <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center">
              <FontAwesome name="truck" size={28} color="#fff" />
            </View>
            <Text className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Connexion Agent Terrain
            </Text>
            <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
              Accédez à votre espace pour gérer les opérations de déchargement.
            </Text>
          </View>

          <View className="mt-10 gap-4">
            <StyledTextInput
              label="Email professionnel"
              placeholder="agent@entreprise.com"
              value={email}
              onChangeText={setEmail}
              leftIcon={<FontAwesome name="envelope" size={18} color="#6B7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <StyledTextInput
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!show}
              leftIcon={<FontAwesome name="lock" size={18} color="#6B7280" />}
              rightIcon={<Text onPress={() => setShow((s) => !s)} className="px-2">
                {show ? (
                  <FontAwesome name="eye" size={18} color="#6B7280" />
                ) : (
                  <FontAwesome name="eye-slash" size={18} color="#6B7280" />
                )}
              </Text>}
            />

            {error ? (
              <Text className="text-red-600 text-sm mt-1">{error}</Text>
            ) : null}

            <StyledButton
              title={loading ? 'Connexion…' : 'Se connecter'}
              onPress={onSubmit}
              disabled={!isValid || loading}
              loading={loading}
            />

            <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              En vous connectant, vous acceptez nos Conditions et notre Politique de confidentialité.
            </Text>
          </View>

          <View className="mt-auto mb-6 items-center">
            <Text className="text-gray-400 text-xs">v1.0 • Système de Gestion de Déchargement</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
