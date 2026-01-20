import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const baseStyles = 'items-center justify-center rounded-2xl flex-row';

  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
  };

  const sizeStyles = {
    sm: 'py-2 px-4',
    md: 'py-4 px-6',
    lg: 'py-5 px-8',
  };

  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
    ghost: 'text-primary',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled || loading ? 'opacity-50' : 'active:opacity-80'}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? 'white' : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && <Text className="mr-2 text-xl">{icon}</Text>}
          <Text
            className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
