import StyledButton from "@/components/ui/styled-button";
import StyledTextInput from "@/components/ui/styled-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginDefaultValues, loginSchema } from "../data/login-schemas";

export const LoginForm = () => {
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, submitCount },
        setError,
        clearErrors,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: loginDefaultValues,
        mode: "onChange",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        if (submitCount > 0) {
            if (errors.email) emailRef.current?.focus();
            else if (errors.password) passwordRef.current?.focus();
        }
    }, [errors.email, errors.password, submitCount]);

    const onSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace("/(tabs)");
        }, 1500);
    };

    return (
        <View className="bg-white rounded-2xl p-6 shadow shadow-black/10">
            {/* Email */}
            <View className="mt-4 gap-4 w-full mb-4">
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
                            leftIcon={<Mail color="#6B7280" size={18} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                passwordRef.current?.focus();
                            }}
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
                            placeholder="********"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showPassword}
                            ref={passwordRef}
                            leftIcon={<Lock color="#6B7280" size={18} />}
                            rightIcon={
                                <Text
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="text-emerald-600 font-medium"
                                >
                                    {showPassword ? (
                                        <Eye color="#6B7280" size={18} />
                                    ) : (
                                        <EyeOff color="#6B7280" size={18} />
                                    )}
                                </Text>
                            }
                            returnKeyType="go"
                            onSubmitEditing={handleSubmit(onSubmit)}
                            errorText={errors.password?.message}
                        />
                    )}
                />
            </View>
            {/* Password */}
            {/* <View className="mb-5">
            </View> */}

            {/* Login button */}
            <StyledButton
                title={loading ? "Connexion..." : "Se connecter"}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
                loading={loading}
            />

            {/* Forgot password */}
            <TouchableOpacity className="items-center mt-4" disabled={loading}>
                <Text className="text-emerald-600 text-sm font-medium">
                    Mot de passe oublié ?
                </Text>
            </TouchableOpacity>
        </View>
    );
};
