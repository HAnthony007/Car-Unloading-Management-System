import React from 'react';
import { ActivityIndicator, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle; // still allow inline style overrides
  textStyle?: TextStyle; // still allow inline text style overrides
  icon?: React.ReactNode;
  className?: string; // tailwind overrides for container
  textClassName?: string; // tailwind overrides for text
  loading?: boolean; // show spinner
  loadingText?: string; // optional replacement label while loading
  loadingIndicator?: React.ReactNode; // custom indicator
  fullWidth?: boolean; // takes full horizontal space
}


export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
  className,
  textClassName,
  loading = false,
  loadingText,
  loadingIndicator,
  fullWidth = false,
}: ButtonProps) {
  const base = 'flex-row items-center justify-center rounded-lg';

  const variantClasses: Record<typeof variant, string> = {
    primary: 'bg-emerald-600',
    secondary: 'bg-gray-100',
    outline: 'bg-transparent border border-gray-300',
    danger: 'bg-red-600',
    ghost: 'bg-transparent',
  } as const;

  const sizeClasses: Record<typeof size, string> = {
    small: 'px-3 py-1.5',
    medium: 'px-4 py-2',
    large: 'px-5 py-3',
  } as const;

  const disabledClasses = disabled ? 'opacity-50' : '';

  const textBase = 'font-semibold text-center';
  const textVariant: Record<typeof variant, string> = {
    primary: 'text-white',
    secondary: 'text-gray-700',
    outline: 'text-gray-700',
    danger: 'text-white',
    ghost: 'text-emerald-600',
  } as const;

  const textSize: Record<typeof size, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  } as const;

  const containerClassName = cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    fullWidth && 'w-full',
    className,
  );

  const labelClassName = cn(
    textBase,
    textVariant[variant],
    textSize[size],
    disabled && 'opacity-70',
    textClassName,
  );

  const spinnerColor = (variant === 'secondary' || variant === 'outline') ? '#374151' : (variant === 'ghost' ? '#059669' : '#FFFFFF');

  return (
    <Pressable
      className={containerClassName}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {/* Icon (hidden while loading) */}
      {!loading && icon && <View className="mr-2">{icon}</View>}
      {/* Spinner overlay / inline */}
      {loading && (
        <View className="mr-2">
          {loadingIndicator || <ActivityIndicator size="small" color={spinnerColor} />}
        </View>
      )}
      <Text
        className={labelClassName}
        style={textStyle}
        // If loading and no loadingText provided, reduce opacity of original title
      >
        {loading ? (loadingText ?? title) : title}
      </Text>
    </Pressable>
  );
}

// Notes:
// - Converted to Tailwind (NativeWind) utility classes; kept style & textStyle for backward compatibility.
// - Added className & textClassName for Tailwind customization.
// - Added loading state (loading, loadingText, loadingIndicator) disabling interaction & showing spinner.
// - Gap replaced with 'mr-2' on icon/spinner to avoid relying on gap support across platforms.