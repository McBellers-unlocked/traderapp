import { View, Pressable } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}

export function Card({ children, onPress, className = '' }: CardProps) {
  const baseStyles = 'bg-surface rounded-2xl border border-gray-100';

  if (onPress) {
    return (
      <Pressable
        className={`${baseStyles} active:opacity-90 ${className}`}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={`${baseStyles} ${className}`}>{children}</View>;
}
