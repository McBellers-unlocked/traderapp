import { View } from 'react-native';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop, Ellipse, Rect } from 'react-native-svg';

interface SparkyProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'thinking' | 'excited' | 'waving' | 'celebrating' | 'curious';
  showGlow?: boolean;
  animated?: boolean;
}

export function Sparky({
  size = 'lg',
  expression = 'happy',
  showGlow = true,
}: SparkyProps) {
  const sizes = {
    sm: 80,
    md: 120,
    lg: 180,
    xl: 240,
  };

  const actualSize = sizes[size];

  // Eye positions based on expression
  const getEyeStyle = () => {
    switch (expression) {
      case 'thinking':
        return { leftX: 75, rightX: 115, lookUp: true };
      case 'curious':
        return { leftX: 78, rightX: 122, lookUp: false };
      case 'excited':
        return { leftX: 78, rightX: 118, lookUp: false, sparkle: true };
      default:
        return { leftX: 78, rightX: 118, lookUp: false };
    }
  };

  const eyeStyle = getEyeStyle();

  return (
    <View className="items-center justify-center">
      {showGlow && (
        <View
          style={{
            position: 'absolute',
            width: actualSize * 1.3,
            height: actualSize * 1.3,
            borderRadius: actualSize * 0.65,
            backgroundColor: '#8B5CF6',
            opacity: 0.15,
          }}
        />
      )}
      <Svg width={actualSize} height={actualSize} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#818CF8" />
            <Stop offset="50%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#4F46E5" />
          </LinearGradient>
          <LinearGradient id="bodyHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#A5B4FC" />
            <Stop offset="100%" stopColor="#818CF8" />
          </LinearGradient>
          <LinearGradient id="antennaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="50%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
          <LinearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F1F5F9" />
          </LinearGradient>
        </Defs>

        {/* Shadow */}
        <Ellipse cx="100" cy="185" rx="50" ry="10" fill="#1E293B" opacity={0.1} />

        {/* Body */}
        <G>
          {/* Main body */}
          <Circle cx="100" cy="110" r="72" fill="url(#bodyGradient)" />

          {/* Body highlight */}
          <Path
            d="M 45 85 Q 50 50 100 45 Q 150 50 155 85 Q 140 70 100 65 Q 60 70 45 85"
            fill="url(#bodyHighlight)"
            opacity={0.6}
          />

          {/* Belly plate */}
          <Ellipse cx="100" cy="140" rx="35" ry="25" fill="#4F46E5" opacity={0.3} />
          <Ellipse cx="100" cy="138" rx="30" ry="20" fill="#6366F1" opacity={0.3} />
        </G>

        {/* Ears/Side modules */}
        <G>
          {/* Left ear */}
          <Circle cx="30" cy="95" r="16" fill="url(#bodyGradient)" />
          <Circle cx="30" cy="95" r="10" fill="#A5B4FC" />
          <Circle cx="30" cy="95" r="5" fill="#C7D2FE" />

          {/* Right ear */}
          <Circle cx="170" cy="95" r="16" fill="url(#bodyGradient)" />
          <Circle cx="170" cy="95" r="10" fill="#A5B4FC" />
          <Circle cx="170" cy="95" r="5" fill="#C7D2FE" />
        </G>

        {/* Antenna */}
        <G>
          <Path
            d="M 100 38 L 100 55"
            stroke="url(#bodyGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Antenna ball with glow effect */}
          <Circle cx="100" cy="30" r="14" fill="url(#antennaGlow)" />
          <Circle cx="100" cy="30" r="10" fill="#FDE047" />
          <Circle cx="96" cy="26" r="4" fill="#FFFFFF" opacity={0.8} />

          {/* Lightning bolt spark */}
          <Path
            d="M 96 22 L 104 30 L 99 30 L 106 38 L 94 28 L 100 28 Z"
            fill="#FFFFFF"
            opacity={0.9}
          />
        </G>

        {/* Face plate */}
        <G>
          <Ellipse cx="100" cy="95" rx="52" ry="45" fill="url(#faceGradient)" />

          {/* Face plate border/depth */}
          <Ellipse
            cx="100"
            cy="95"
            rx="52"
            ry="45"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="2"
          />
        </G>

        {/* Eyes */}
        <G>
          {/* Left eye white */}
          <Ellipse cx="78" cy="88" rx="16" ry="18" fill="#FFFFFF" />
          <Ellipse cx="78" cy="88" rx="16" ry="18" fill="none" stroke="#E2E8F0" strokeWidth="1" />

          {/* Left pupil */}
          <Circle
            cx={eyeStyle.leftX}
            cy={eyeStyle.lookUp ? 84 : 90}
            r="10"
            fill="#1E293B"
          />
          <Circle
            cx={eyeStyle.leftX + 2}
            cy={eyeStyle.lookUp ? 81 : 87}
            r="4"
            fill="#FFFFFF"
          />
          <Circle
            cx={eyeStyle.leftX - 2}
            cy={eyeStyle.lookUp ? 86 : 92}
            r="2"
            fill="#FFFFFF"
            opacity={0.6}
          />

          {/* Right eye white */}
          <Ellipse cx="122" cy="88" rx="16" ry="18" fill="#FFFFFF" />
          <Ellipse cx="122" cy="88" rx="16" ry="18" fill="none" stroke="#E2E8F0" strokeWidth="1" />

          {/* Right pupil */}
          <Circle
            cx={eyeStyle.rightX}
            cy={eyeStyle.lookUp ? 84 : 90}
            r="10"
            fill="#1E293B"
          />
          <Circle
            cx={eyeStyle.rightX + 2}
            cy={eyeStyle.lookUp ? 81 : 87}
            r="4"
            fill="#FFFFFF"
          />
          <Circle
            cx={eyeStyle.rightX - 2}
            cy={eyeStyle.lookUp ? 86 : 92}
            r="2"
            fill="#FFFFFF"
            opacity={0.6}
          />

          {/* Sparkle eyes for excited */}
          {eyeStyle.sparkle && (
            <>
              <Path
                d="M 66 78 L 68 82 L 64 80 L 68 78 Z"
                fill="#FBBF24"
              />
              <Path
                d="M 132 78 L 134 82 L 130 80 L 134 78 Z"
                fill="#FBBF24"
              />
            </>
          )}

          {/* Eyebrows based on expression */}
          {expression === 'thinking' && (
            <>
              <Path d="M 65 72 Q 78 68 90 74" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <Path d="M 110 74 Q 122 68 135 72" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}
          {expression === 'curious' && (
            <>
              <Path d="M 65 74 Q 78 70 90 74" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <Path d="M 110 70 Q 122 66 135 72" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}
        </G>

        {/* Cheek blush */}
        <G>
          <Ellipse cx="55" cy="105" rx="12" ry="7" fill="#FDA4AF" opacity={0.5} />
          <Ellipse cx="145" cy="105" rx="12" ry="7" fill="#FDA4AF" opacity={0.5} />
        </G>

        {/* Mouth based on expression */}
        <G>
          {expression === 'happy' && (
            <Path
              d="M 80 112 Q 100 128 120 112"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {expression === 'excited' && (
            <>
              <Ellipse cx="100" cy="118" rx="15" ry="12" fill="#1E293B" />
              <Ellipse cx="100" cy="114" rx="10" ry="6" fill="#FCA5A5" />
            </>
          )}
          {expression === 'thinking' && (
            <G>
              <Circle cx="115" cy="115" r="8" fill="none" stroke="#1E293B" strokeWidth="3" />
              {/* Thought bubbles */}
              <Circle cx="145" cy="70" r="5" fill="#E2E8F0" />
              <Circle cx="160" cy="55" r="8" fill="#E2E8F0" />
              <Circle cx="175" cy="40" r="12" fill="#E2E8F0" />
            </G>
          )}
          {expression === 'waving' && (
            <Path
              d="M 80 112 Q 100 126 120 112"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {expression === 'celebrating' && (
            <>
              <Ellipse cx="100" cy="118" rx="18" ry="14" fill="#1E293B" />
              <Ellipse cx="100" cy="114" rx="12" ry="7" fill="#FCA5A5" />
              {/* Confetti */}
              <Circle cx="40" cy="50" r="4" fill="#FBBF24" />
              <Circle cx="160" cy="45" r="3" fill="#EC4899" />
              <Circle cx="50" cy="35" r="3" fill="#10B981" />
              <Circle cx="150" cy="30" r="4" fill="#6366F1" />
              <Rect x="30" y="60" width="6" height="6" fill="#F59E0B" transform="rotate(45, 33, 63)" />
              <Rect x="165" y="55" width="5" height="5" fill="#8B5CF6" transform="rotate(30, 167, 57)" />
            </>
          )}
          {expression === 'curious' && (
            <Ellipse cx="100" cy="116" rx="8" ry="10" fill="#1E293B" />
          )}
        </G>

        {/* Arms */}
        <G>
          {/* Left arm (always visible) */}
          <Path
            d="M 35 120 Q 25 140 30 160"
            stroke="url(#bodyGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx="30" cy="165" r="10" fill="#A5B4FC" />

          {/* Right arm - waving or normal */}
          {(expression === 'waving' || expression === 'celebrating') ? (
            <G>
              <Path
                d="M 165 120 Q 185 90 190 60"
                stroke="url(#bodyGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="190" cy="55" r="10" fill="#A5B4FC" />
              {/* Motion lines */}
              <Path d="M 195 45 L 205 40" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
              <Path d="M 198 55 L 210 55" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
              <Path d="M 195 65 L 205 70" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
            </G>
          ) : (
            <G>
              <Path
                d="M 165 120 Q 175 140 170 160"
                stroke="url(#bodyGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="170" cy="165" r="10" fill="#A5B4FC" />
            </G>
          )}
        </G>

        {/* Feet */}
        <G>
          <Ellipse cx="75" cy="178" rx="18" ry="10" fill="url(#bodyGradient)" />
          <Ellipse cx="125" cy="178" rx="18" ry="10" fill="url(#bodyGradient)" />
        </G>
      </Svg>
    </View>
  );
}

// Export old Mascot as alias for backwards compatibility
export { Sparky as ImprovedMascot };
