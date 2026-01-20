import { View, Text, Image } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'wordmark';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
}

export function Logo({ size = 'md', variant = 'full', theme = 'light', showTagline = false }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 18, tagline: 10, gap: 6 },
    md: { icon: 48, text: 26, tagline: 12, gap: 10 },
    lg: { icon: 64, text: 34, tagline: 14, gap: 12 },
    xl: { icon: 96, text: 48, tagline: 18, gap: 16 },
  };

  const { icon: iconSize, text: textSize, tagline: taglineSize, gap } = sizes[size];

  // Updated colors to match new branding
  const textColor = theme === 'light' ? '#1E293B' : '#FFFFFF';
  const purpleColor = '#7C3AED'; // Vibrant purple from new logo
  const goldColor = '#F59E0B'; // Gold/amber for lightning and tagline

  const LogoIcon = () => (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="newLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8B5CF6" />
          <Stop offset="50%" stopColor="#7C3AED" />
          <Stop offset="100%" stopColor="#5B21B6" />
        </LinearGradient>
        <LinearGradient id="newSparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FCD34D" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Background circle */}
      <Circle cx="50" cy="50" r="46" fill="url(#newLogoGradient)" />

      {/* Robot face */}
      <G>
        {/* Face plate - helmet style */}
        <Path
          d="M 25 45 Q 25 25 50 22 Q 75 25 75 45 L 75 60 Q 75 75 50 78 Q 25 75 25 60 Z"
          fill="#F8FAFC"
        />

        {/* Eyes */}
        <Circle cx="38" cy="48" r="8" fill="#1E293B" />
        <Circle cx="62" cy="48" r="8" fill="#1E293B" />
        <Circle cx="40" cy="46" r="3" fill="#FFFFFF" />
        <Circle cx="64" cy="46" r="3" fill="#FFFFFF" />

        {/* Happy mouth */}
        <Path
          d="M 38 62 Q 50 72 62 62"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy cheeks */}
        <Circle cx="30" cy="55" r="5" fill="#FDA4AF" opacity={0.6} />
        <Circle cx="70" cy="55" r="5" fill="#FDA4AF" opacity={0.6} />

        {/* Antenna base */}
        <Rect x="45" y="12" width="10" height="12" rx="3" fill="#5B21B6" />

        {/* Lightning bolt on top */}
        <Path
          d="M 48 2 L 55 10 L 51 10 L 54 18 L 46 9 L 50 9 Z"
          fill="url(#newSparkGradient)"
        />
      </G>

      {/* Side ear pieces */}
      <Circle cx="18" cy="50" r="7" fill="#7C3AED" />
      <Circle cx="18" cy="50" r="4" fill="#A78BFA" />
      <Circle cx="82" cy="50" r="7" fill="#7C3AED" />
      <Circle cx="82" cy="50" r="4" fill="#A78BFA" />
    </Svg>
  );

  // Lightning bolt SVG for wordmark
  const LightningBolt = ({ height }: { height: number }) => (
    <Svg width={height * 0.5} height={height} viewBox="0 0 24 48" style={{ marginHorizontal: -2 }}>
      <Path
        d="M 14 0 L 4 22 L 12 22 L 8 48 L 20 20 L 12 20 Z"
        fill={goldColor}
      />
    </Svg>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'wordmark') {
    return (
      <View>
        <View className="flex-row items-center">
          <Text style={{ fontSize: textSize, fontWeight: '800', color: textColor, fontFamily: 'System' }}>
            Spark
          </Text>
          <LightningBolt height={textSize * 0.9} />
          <Text style={{ fontSize: textSize, fontWeight: '800', color: purpleColor, fontFamily: 'System' }}>
            AI
          </Text>
        </View>
        {showTagline && (
          <Text style={{ fontSize: taglineSize, color: goldColor, fontWeight: '600', textAlign: 'center', marginTop: 2 }}>
            AI Education for the Next Generation
          </Text>
        )}
      </View>
    );
  }

  // Full logo
  return (
    <View className="flex-row items-center" style={{ gap }}>
      <LogoIcon />
      <View>
        <View className="flex-row items-center">
          <Text style={{ fontSize: textSize, fontWeight: '800', color: textColor }}>
            Spark
          </Text>
          <LightningBolt height={textSize * 0.85} />
          <Text style={{ fontSize: textSize, fontWeight: '800', color: purpleColor }}>
            AI
          </Text>
        </View>
        {showTagline && (
          <Text style={{ fontSize: taglineSize, color: goldColor, fontWeight: '600' }}>
            AI Education for the Next Generation
          </Text>
        )}
      </View>
    </View>
  );
}

// App icon version (for app stores) - matches new branding
export function AppIcon({ size = 100 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="appBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#8B5CF6" />
          <Stop offset="50%" stopColor="#7C3AED" />
          <Stop offset="100%" stopColor="#5B21B6" />
        </LinearGradient>
        <LinearGradient id="appSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FCD34D" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Rect x="0" y="0" width="100" height="100" rx="22" fill="url(#appBgGrad)" />

      {/* Sparkle effects */}
      <G opacity={0.8}>
        <Path d="M 15 25 L 17 30 L 15 35 L 13 30 Z" fill="#FCD34D" />
        <Path d="M 85 70 L 87 75 L 85 80 L 83 75 Z" fill="#FCD34D" />
        <Path d="M 20 70 L 21 73 L 20 76 L 19 73 Z" fill="#FCD34D" />
        <Path d="M 80 25 L 81 28 L 80 31 L 79 28 Z" fill="#FCD34D" />
      </G>

      {/* Robot face - helmet style */}
      <G>
        <Path
          d="M 25 48 Q 25 28 50 25 Q 75 28 75 48 L 75 62 Q 75 78 50 82 Q 25 78 25 62 Z"
          fill="#F8FAFC"
        />

        {/* Eyes - bigger and more expressive */}
        <Circle cx="38" cy="52" r="10" fill="#1E293B" />
        <Circle cx="62" cy="52" r="10" fill="#1E293B" />
        <Circle cx="41" cy="49" r="4" fill="#FFFFFF" />
        <Circle cx="65" cy="49" r="4" fill="#FFFFFF" />
        <Circle cx="38" cy="54" r="2" fill="#FFFFFF" opacity={0.5} />
        <Circle cx="62" cy="54" r="2" fill="#FFFFFF" opacity={0.5} />

        {/* Happy open mouth */}
        <Path
          d="M 40 68 Q 50 78 60 68"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy cheeks */}
        <Circle cx="28" cy="60" r="6" fill="#FDA4AF" opacity={0.5} />
        <Circle cx="72" cy="60" r="6" fill="#FDA4AF" opacity={0.5} />

        {/* Antenna */}
        <Rect x="44" y="12" width="12" height="15" rx="4" fill="#5B21B6" />

        {/* Lightning bolt */}
        <Path
          d="M 47 2 L 56 12 L 51 12 L 55 22 L 44 10 L 50 10 Z"
          fill="url(#appSparkGrad)"
        />
      </G>

      {/* Ear pieces */}
      <Circle cx="16" cy="55" r="9" fill="#7C3AED" />
      <Circle cx="16" cy="55" r="5" fill="#A78BFA" />
      <Circle cx="84" cy="55" r="9" fill="#7C3AED" />
      <Circle cx="84" cy="55" r="5" fill="#A78BFA" />

      {/* Chest badge */}
      <Circle cx="50" cy="90" r="8" fill="#5B21B6" />
      <Path
        d="M 49 85 L 52 89 L 50 89 L 52 95 L 47 88 L 50 88 Z"
        fill="#FCD34D"
      />
    </Svg>
  );
}
