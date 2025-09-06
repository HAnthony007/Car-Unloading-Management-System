import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow shadow-black/10">
      {/* Email */}
      <View className="mb-5">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 bg-gray-50"
          placeholder="Entrez votre email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {/* Password */}
      <View className="mb-5">
        <Text className="text-sm font-medium text-gray-700 mb-2">Mot de passe</Text>
        <View className="flex flex-row items-center border border-gray-300 rounded-lg bg-gray-50">
          <TextInput
            className="flex-1 px-3 py-3 text-base text-gray-900"
            placeholder="Entrez votre mot de passe"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            className="p-3"
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeOff color="#6B7280" size={20} />
            ) : (
              <Eye color="#6B7280" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* Login button */}
      <TouchableOpacity
        className={`bg-emerald-600 rounded-lg py-4 items-center mt-2 ${
          loading ? "opacity-60" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
        accessibilityRole="button"
      >
        <Text className="text-white text-base font-semibold">
          {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>
      {/* Forgot password */}
      <TouchableOpacity className="items-center mt-4" disabled={loading}>
        <Text className="text-emerald-600 text-sm font-medium">
          Mot de passe oublié ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};