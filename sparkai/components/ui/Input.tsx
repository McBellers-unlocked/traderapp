import { useState } from 'react';
import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  rightIcon,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-slate-700 font-semibold mb-2 text-sm">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-white rounded-2xl px-4 border-2 ${
          error
            ? 'border-red-400'
            : isFocused
            ? 'border-indigo-500'
            : 'border-slate-200'
        }`}
        style={{
          shadowColor: isFocused ? '#6366F1' : '#000',
          shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
          shadowOpacity: isFocused ? 0.15 : 0.05,
          shadowRadius: isFocused ? 8 : 4,
          elevation: isFocused ? 4 : 2,
        }}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 py-4 text-slate-800 text-base"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="p-2">
            <Text className="text-slate-400">{isSecure ? '👁️' : '🙈'}</Text>
          </Pressable>
        )}
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
