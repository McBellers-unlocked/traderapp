import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16 },
    md: { paddingVertical: 16, paddingHorizontal: 24 },
    lg: { paddingVertical: 20, paddingHorizontal: 32 },
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={fullWidth ? 'w-full' : ''}
        style={({ pressed }) => ({
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          cursor: 'pointer',
        })}
        role="button"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={['#8B5CF6', '#6366F1', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            ...sizeStyles[size],
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
            pointerEvents: 'none',
          }}
        >
          <View className="flex-row items-center justify-center" style={{ pointerEvents: 'none' }}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                {icon && <View className="mr-2">{icon}</View>}
                <Text
                  className={`text-white font-bold text-center ${textSizes[size]}`}
                  style={{ pointerEvents: 'none' }}
                >
                  {title}
                </Text>
              </>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`bg-amber-400 rounded-2xl ${fullWidth ? 'w-full' : ''}`}
        style={({ pressed }) => ({
          ...sizeStyles[size],
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: '#F59E0B',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        })}
      >
        <View className="flex-row items-center justify-center">
          {loading ? (
            <ActivityIndicator color="#1E293B" />
          ) : (
            <>
              {icon && <View className="mr-2">{icon}</View>}
              <Text className={`text-slate-900 font-bold text-center ${textSizes[size]}`}>
                {title}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    );
  }

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`bg-white border-2 border-indigo-500 rounded-2xl ${fullWidth ? 'w-full' : ''}`}
        style={({ pressed }) => ({
          ...sizeStyles[size],
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <View className="flex-row items-center justify-center">
          {loading ? (
            <ActivityIndicator color="#6366F1" />
          ) : (
            <>
              {icon && <View className="mr-2">{icon}</View>}
              <Text className={`text-indigo-600 font-bold text-center ${textSizes[size]}`}>
                {title}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    );
  }

  // Ghost variant
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={fullWidth ? 'w-full' : ''}
      style={({ pressed }) => ({
        ...sizeStyles[size],
        opacity: isDisabled ? 0.6 : pressed ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <ActivityIndicator color="#6366F1" />
        ) : (
          <>
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`text-indigo-600 font-semibold text-center ${textSizes[size]}`}>
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
