import { StyledButton } from '@/components/ui/StyledButton';
import { StyledTextInput } from '@/components/ui/StyledTextInput';
import { mapAuthApiErrorsToLoginForm } from '@/src/modules/auth/services/forms/errors';
import { loginDefaultValues, loginSchema, type LoginFormValues } from '@/src/modules/auth/validation/auth';
import { useAuth } from '@/src/providers/AuthProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { errors, isValid, submitCount }, setError, clearErrors } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Focus management: watch for errors after submit
  useEffect(() => {
    if (submitCount > 0) {
      if (errors.email) emailRef.current?.focus();
      else if (errors.password) passwordRef.current?.focus();
    }
  }, [errors.email, errors.password, submitCount]);

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    // clear previous API mapping
    clearErrors();
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e) {
  mapAuthApiErrorsToLoginForm(setError, e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-6">
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

          <View className="mt-4 gap-4 w-full">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  label="Email professionnel"
                  placeholder="agent@entreprise.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  ref={emailRef}
                  leftIcon={<FontAwesome name="envelope" size={18} color="#6B7280" />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  errorText={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  label="Mot de passe"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!show}
                  ref={passwordRef}
                  leftIcon={<FontAwesome name="lock" size={18} color="#6B7280" />}
                  rightIcon={<Text onPress={() => setShow((s) => !s)} className="px-2">
                    {show ? (
                      <FontAwesome name="eye" size={18} color="#6B7280" />
                    ) : (
                      <FontAwesome name="eye-slash" size={18} color="#6B7280" />
                    )}
                  </Text>}
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  errorText={errors.password?.message}
                />
              )}
            />

            <StyledButton
              title={loading ? 'Connexion…' : 'Se connecter'}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading}
              loading={loading}
            />

            <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              En vous connectant, vous acceptez nos Conditions et notre Politique de confidentialité.
            </Text>
          </View>

          <View className="absolute bottom-6 left-0 right-0 items-center">
            <Text className="text-gray-400 text-xs">v1.0 • Système de Gestion de Déchargement</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
