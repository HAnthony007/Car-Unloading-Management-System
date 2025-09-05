import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const StyledButton: React.FC<Props> = ({
  title,
  onPress,
  disabled,
  leftIcon,
  rightIcon,
  loading,
  variant = 'primary',
}) => {
  const base = 'w-full items-center justify-center rounded-xl px-4 py-3 active:opacity-90';
  const variantCls =
    variant === 'primary'
      ? 'bg-primary disabled:opacity-60'
      : 'bg-gray-100 dark:bg-neutral-800 disabled:bg-gray-200';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variantCls}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center">
        {loading ? (
          <ActivityIndicator color="#fff" className="mr-2" />
        ) : leftIcon ? (
          <View className="mr-2">{leftIcon}</View>
        ) : null}
        <Text
          className={variant === 'primary' ? 'text-white font-semibold' : 'text-gray-900 dark:text-gray-100 font-semibold'}
        >
          {title}
        </Text>
        {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
    </Pressable>
  );
};

export default StyledButton;
