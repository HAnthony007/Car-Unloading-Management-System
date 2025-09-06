import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { cn } from '../../lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium';
  style?: ViewStyle; // inline overrides
  textStyle?: TextStyle; // inline text overrides
  className?: string; // tailwind overrides for container
  textClassName?: string; // tailwind overrides for text
  pill?: boolean; // fully rounded shape
  uppercase?: boolean; // transform text
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}


export function Badge({
  label,
  variant = 'neutral',
  size = 'medium',
  style,
  textStyle,
  className,
  textClassName,
  pill = false,
  uppercase = false,
  iconLeft,
  iconRight,
}: BadgeProps) {
  const base = 'self-start flex-row items-center';
  const shape = pill ? 'rounded-full' : 'rounded-[12px]';

  const variantBg: Record<typeof variant, string> = {
    success: 'bg-emerald-100',
    warning: 'bg-amber-100',
    error: 'bg-rose-100',
    info: 'bg-blue-100',
    neutral: 'bg-gray-100',
  } as const;

  const variantText: Record<typeof variant, string> = {
    success: 'text-emerald-600',
    warning: 'text-amber-700',
    error: 'text-rose-600',
    info: 'text-blue-600',
    neutral: 'text-gray-600',
  } as const;

  const sizeContainer: Record<typeof size, string> = {
    small: 'px-1.5 py-0.5', // ~6px x 2px
    medium: 'px-2 py-1', // ~8px x 4px
  } as const;

  const sizeText: Record<typeof size, string> = {
    small: 'text-[10px]',
    medium: 'text-xs',
  } as const;

  const containerClass = cn(base, shape, variantBg[variant], sizeContainer[size], className);
  const textClass = cn('font-semibold', variantText[variant], sizeText[size], uppercase && 'uppercase', textClassName);

  return (
    <View className={containerClass} style={style}>
      {iconLeft && <View className="mr-1">{iconLeft}</View>}
      <Text className={textClass} style={textStyle}>{label}</Text>
      {iconRight && <View className="ml-1">{iconRight}</View>}
    </View>
  );
}

// Notes:
// - Migrated to Tailwind / NativeWind utilities.
// - Added className & textClassName, pill, uppercase, iconLeft/iconRight for flexibility.
// - Maintains ability to override via style / textStyle.