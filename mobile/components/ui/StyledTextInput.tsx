import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorText?: string;
  containerClassName?: string;
  inputClassName?: string;
};

export const StyledTextInput: React.FC<Props> = ({
  label,
  leftIcon,
  rightIcon,
  errorText,
  containerClassName,
  inputClassName,
  ...props
}) => {
  return (
    <View className={containerClassName}>
      {label ? (
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
      ) : null}
      <View className="flex-row items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2.5">
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor="#9CA3AF"
          className={
            "flex-1 text-base text-gray-900 dark:text-gray-100" +
            (inputClassName ? ` ${inputClassName}` : '')
          }
          {...props}
        />
        {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
      {errorText ? (
        <Text className="mt-1 text-xs text-red-600">{errorText}</Text>
      ) : null}
    </View>
  );
};

export default StyledTextInput;
