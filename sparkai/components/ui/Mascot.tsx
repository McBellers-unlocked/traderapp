import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Ellipse } from 'react-native-svg';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'thinking' | 'excited' | 'waving';
  showGlow?: boolean;
}

export function Mascot({ size = 'lg', expression = 'happy', showGlow = true }: MascotProps) {
  const sizes = {
    sm: 80,
    md: 120,
    lg: 180,
    xl: 240,
  };

  const actualSize = sizes[size];

  return (
    <View className="items-center justify-center">
      {showGlow && (
        <View
          style={{
            position: 'absolute',
            width: actualSize * 1.2,
            height: actualSize * 1.2,
            borderRadius: actualSize * 0.6,
            backgroundColor: '#8B5CF6',
            opacity: 0.2,
          }}
        />
      )}
      <Svg width={actualSize} height={actualSize} viewBox="0 0 200 200">
        {/* Body - Rounded robot shape */}
        <G>
          {/* Main body gradient effect using layered shapes */}
          <Circle cx="100" cy="110" r="70" fill="#6366F1" />
          <Circle cx="100" cy="105" r="65" fill="#818CF8" />
          <Circle cx="100" cy="100" r="60" fill="#A5B4FC" />

          {/* Face plate */}
          <Ellipse cx="100" cy="95" rx="45" ry="40" fill="#F8FAFC" />

          {/* Eyes */}
          <G>
            {/* Left eye */}
            <Circle cx="80" cy="90" r="12" fill="#1E293B" />
            <Circle cx="83" cy="87" r="4" fill="#FFFFFF" />

            {/* Right eye */}
            <Circle cx="120" cy="90" r="12" fill="#1E293B" />
            <Circle cx="123" cy="87" r="4" fill="#FFFFFF" />

            {/* Eye sparkles */}
            {expression === 'excited' && (
              <>
                <Circle cx="75" cy="82" r="2" fill="#FBBF24" />
                <Circle cx="125" cy="82" r="2" fill="#FBBF24" />
              </>
            )}
          </G>

          {/* Mouth based on expression */}
          {expression === 'happy' && (
            <Path
              d="M 85 105 Q 100 120 115 105"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {expression === 'excited' && (
            <Ellipse cx="100" cy="110" rx="12" ry="8" fill="#1E293B" />
          )}
          {expression === 'thinking' && (
            <Path
              d="M 88 108 L 112 108"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {expression === 'waving' && (
            <Path
              d="M 85 105 Q 100 118 115 105"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Antenna */}
          <Path
            d="M 100 40 L 100 55"
            stroke="#6366F1"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <Circle cx="100" cy="35" r="8" fill="#FBBF24" />
          <Circle cx="100" cy="35" r="4" fill="#FCD34D" />

          {/* Ears/Side details */}
          <Circle cx="35" cy="100" r="12" fill="#6366F1" />
          <Circle cx="35" cy="100" r="6" fill="#818CF8" />
          <Circle cx="165" cy="100" r="12" fill="#6366F1" />
          <Circle cx="165" cy="100" r="6" fill="#818CF8" />

          {/* Cheek blush */}
          <Ellipse cx="65" cy="105" rx="8" ry="5" fill="#FCA5A5" opacity={0.6} />
          <Ellipse cx="135" cy="105" rx="8" ry="5" fill="#FCA5A5" opacity={0.6} />

          {/* Waving arm for waving expression */}
          {expression === 'waving' && (
            <G>
              <Path
                d="M 160 120 Q 175 100 185 80"
                stroke="#6366F1"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="185" cy="75" r="10" fill="#A5B4FC" />
            </G>
          )}
        </G>
      </Svg>
    </View>
  );
}

export function MascotWithSpeech({
  message,
  size = 'md',
  expression = 'happy'
}: {
  message: string;
  size?: 'sm' | 'md' | 'lg';
  expression?: 'happy' | 'thinking' | 'excited' | 'waving';
}) {
  return (
    <View className="flex-row items-end">
      <Mascot size={size} expression={expression} showGlow={false} />
      <View
        className="bg-white rounded-2xl px-4 py-3 ml-2 max-w-[200px]"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className="text-slate-700 text-sm">{message}</Text>
        {/* Speech bubble pointer */}
        <View
          style={{
            position: 'absolute',
            left: -8,
            bottom: 15,
            width: 0,
            height: 0,
            borderTopWidth: 8,
            borderTopColor: 'transparent',
            borderBottomWidth: 8,
            borderBottomColor: 'transparent',
            borderRightWidth: 10,
            borderRightColor: 'white',
          }}
        />
      </View>
    </View>
  );
}
