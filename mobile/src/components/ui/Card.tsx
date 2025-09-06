import React from 'react';
import { View, ViewStyle } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle; // inline overrides still supported
  padding?: number; // custom numeric padding (falls back to style rather than tailwind)
  className?: string; // Tailwind / NativeWind utility overrides
  noShadow?: boolean; // optionally remove shadow
  elevated?: boolean; // stronger elevation
  pressable?: boolean; // future proof; if true could wrap in Pressable (not implemented yet)
}


export function Card({
  children,
  style,
  padding = 16,
  className,
  noShadow = false,
  elevated = false,
}: CardProps) {
  // Base design tokens mapped to utilities.
  // shadow-sm is a subtle shadow; elevated uses shadow plus platform elevation via style.
  const base = 'bg-white rounded-xl';
  const shadow = noShadow ? '' : (elevated ? 'shadow-md' : 'shadow');
  const containerClassName = cn(base, shadow, className);

  return (
    <View
      className={containerClassName}
      style={[
        // Keep numeric padding support (since arbitrary numbers may not map to a p-* class)
        { padding },
        elevated && !noShadow && { elevation: 4 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Notes:
// - Converted to Tailwind / NativeWind utility classes.
// - Added className, noShadow, elevated props for flexibility.
// - Retained numeric padding prop to avoid forcing tailwind scale.
// - Elevation handled via style for Android in addition to shadow classes.