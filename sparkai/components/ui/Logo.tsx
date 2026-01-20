import { View, Text } from 'react-native';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'wordmark';
  theme?: 'light' | 'dark';
}

export function Logo({ size = 'md', variant = 'full', theme = 'light' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 16, gap: 6 },
    md: { icon: 48, text: 24, gap: 8 },
    lg: { icon: 64, text: 32, gap: 12 },
    xl: { icon: 96, text: 48, gap: 16 },
  };

  const { icon: iconSize, text: textSize, gap } = sizes[size];
  const textColor = theme === 'light' ? '#1E293B' : '#FFFFFF';
  const accentColor = theme === 'light' ? '#6366F1' : '#A5B4FC';

  const LogoIcon = () => (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#6366F1" />
          <Stop offset="50%" stopColor="#8B5CF6" />
          <Stop offset="100%" stopColor="#A855F7" />
        </LinearGradient>
        <LinearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FBBF24" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Background circle */}
      <Circle cx="50" cy="50" r="46" fill="url(#logoGradient)" />

      {/* Inner glow */}
      <Circle cx="50" cy="50" r="38" fill="#818CF8" opacity={0.3} />

      {/* Robot face */}
      <G>
        {/* Face plate */}
        <Rect x="25" y="30" width="50" height="40" rx="12" fill="#F8FAFC" />

        {/* Eyes */}
        <Circle cx="38" cy="45" r="7" fill="#1E293B" />
        <Circle cx="62" cy="45" r="7" fill="#1E293B" />
        <Circle cx="40" cy="43" r="2.5" fill="#FFFFFF" />
        <Circle cx="64" cy="43" r="2.5" fill="#FFFFFF" />

        {/* Happy mouth */}
        <Path
          d="M 40 58 Q 50 66 60 58"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Antenna */}
        <Path
          d="M 50 20 L 50 30"
          stroke="#F8FAFC"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Circle cx="50" cy="16" r="6" fill="url(#sparkGradient)" />

        {/* Spark/lightning bolt */}
        <Path
          d="M 48 12 L 52 16 L 49 16 L 52 20 L 47 15 L 50 15 Z"
          fill="#FFFFFF"
        />
      </G>

      {/* Side accents */}
      <Circle cx="18" cy="50" r="6" fill="#A5B4FC" />
      <Circle cx="82" cy="50" r="6" fill="#A5B4FC" />
    </Svg>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'wordmark') {
    return (
      <View className="flex-row items-center">
        <Text style={{ fontSize: textSize, fontWeight: '800', color: textColor }}>
          Spark
        </Text>
        <Text style={{ fontSize: textSize, fontWeight: '800', color: accentColor }}>
          AI
        </Text>
      </View>
    );
  }

  // Full logo
  return (
    <View className="flex-row items-center" style={{ gap }}>
      <LogoIcon />
      <View className="flex-row items-center">
        <Text style={{ fontSize: textSize, fontWeight: '800', color: textColor }}>
          Spark
        </Text>
        <Text style={{ fontSize: textSize, fontWeight: '800', color: accentColor }}>
          AI
        </Text>
      </View>
    </View>
  );
}

// App icon version (for app stores)
export function AppIcon({ size = 100 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="appBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#6366F1" />
          <Stop offset="50%" stopColor="#8B5CF6" />
          <Stop offset="100%" stopColor="#A855F7" />
        </LinearGradient>
        <LinearGradient id="appSparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FBBF24" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="100" height="100" rx="22" fill="url(#appBgGradient)" />

      {/* Subtle pattern */}
      <Circle cx="20" cy="20" r="30" fill="#FFFFFF" opacity={0.05} />
      <Circle cx="80" cy="80" r="40" fill="#FFFFFF" opacity={0.05} />

      {/* Robot face */}
      <G>
        {/* Face plate */}
        <Rect x="22" y="32" width="56" height="44" rx="14" fill="#F8FAFC" />

        {/* Eyes */}
        <Circle cx="38" cy="48" r="8" fill="#1E293B" />
        <Circle cx="62" cy="48" r="8" fill="#1E293B" />
        <Circle cx="40" cy="46" r="3" fill="#FFFFFF" />
        <Circle cx="64" cy="46" r="3" fill="#FFFFFF" />

        {/* Happy mouth */}
        <Path
          d="M 40 62 Q 50 72 60 62"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheek blush */}
        <Circle cx="30" cy="58" r="5" fill="#FCA5A5" opacity={0.5} />
        <Circle cx="70" cy="58" r="5" fill="#FCA5A5" opacity={0.5} />

        {/* Antenna */}
        <Path
          d="M 50 18 L 50 32"
          stroke="#F8FAFC"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <Circle cx="50" cy="14" r="8" fill="url(#appSparkGradient)" />

        {/* Lightning spark */}
        <Path
          d="M 47 9 L 53 14 L 49 14 L 54 19 L 46 13 L 51 13 Z"
          fill="#FFFFFF"
        />
      </G>

      {/* Side ears */}
      <Circle cx="12" cy="54" r="8" fill="#A5B4FC" />
      <Circle cx="12" cy="54" r="4" fill="#C7D2FE" />
      <Circle cx="88" cy="54" r="8" fill="#A5B4FC" />
      <Circle cx="88" cy="54" r="4" fill="#C7D2FE" />
    </Svg>
  );
}
