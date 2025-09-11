import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
    loginDefaultValues,
    LoginFormValues,
    loginSchema,
} from "../data/login-schema";

export const LoginForm = () => {
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, submitCount },
        setError,
        clearErrors,
    } = useForm<LoginFormValues>({
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

    const onSubmit = (data: LoginFormValues) => {
        clearErrors();
        try {
            console.log("Login data:", data);
        } catch (error: any) {
            if (error?.message.includes("email")) {
                setError("email", { message: error.message });
            } else if (error?.message.includes("password")) {
                setError("password", { message: error.message });
            } else {
                console.error("Login error:", error);
            }
        }
    };

    return (
        <View className="bg-white rounded-2xl p-6 shadow shadow-black/10">
            {/* Email */}
            <View className="mt-4 gap-4 w-full mb-4">
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
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
                        <Input
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
            <Button
                title="Connexion..."
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                loading={false}
            />

            {/* Forgot password */}
            <TouchableOpacity className="items-center mt-4" disabled={false}>
                <Text className="text-emerald-600 text-sm font-medium">
                    Mot de passe oublié ?
                </Text>
            </TouchableOpacity>
        </View>
    );
};
