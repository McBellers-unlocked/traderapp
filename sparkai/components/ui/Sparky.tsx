import { View } from 'react-native';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop, Ellipse, Rect } from 'react-native-svg';

interface SparkyProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'thinking' | 'excited' | 'waving' | 'celebrating' | 'curious';
  showGlow?: boolean;
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

  return (
    <View className="items-center justify-center">
      {showGlow && (
        <View
          style={{
            position: 'absolute',
            width: actualSize * 1.3,
            height: actualSize * 1.3,
            borderRadius: actualSize * 0.65,
            backgroundColor: '#7C3AED',
            opacity: 0.15,
          }}
        />
      )}
      <Svg width={actualSize} height={actualSize} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="50%" stopColor="#7C3AED" />
            <Stop offset="100%" stopColor="#5B21B6" />
          </LinearGradient>
          <LinearGradient id="bodyDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B1D6B" />
            <Stop offset="100%" stopColor="#2D1750" />
          </LinearGradient>
          <LinearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="50%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
          <LinearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F1F5F9" />
          </LinearGradient>
        </Defs>

        {/* Sparkle effects */}
        {(expression === 'excited' || expression === 'celebrating' || expression === 'waving') && (
          <G>
            <Path d="M 30 40 L 34 48 L 30 56 L 26 48 Z" fill="#FCD34D" />
            <Path d="M 170 35 L 174 43 L 170 51 L 166 43 Z" fill="#FCD34D" />
            <Path d="M 25 100 L 28 105 L 25 110 L 22 105 Z" fill="#FCD34D" />
            <Path d="M 175 95 L 178 100 L 175 105 L 172 100 Z" fill="#FCD34D" />
          </G>
        )}

        {/* Shadow */}
        <Ellipse cx="100" cy="190" rx="45" ry="8" fill="#1E293B" opacity={0.1} />

        {/* Feet */}
        <G>
          <Ellipse cx="70" cy="180" rx="22" ry="12" fill="url(#bodyDark)" />
          <Ellipse cx="130" cy="180" rx="22" ry="12" fill="url(#bodyDark)" />
          {/* Foot highlights */}
          <Ellipse cx="70" cy="177" rx="15" ry="6" fill="#7C3AED" opacity={0.5} />
          <Ellipse cx="130" cy="177" rx="15" ry="6" fill="#7C3AED" opacity={0.5} />
        </G>

        {/* Body */}
        <G>
          {/* Main body - rounder like new design */}
          <Ellipse cx="100" cy="130" rx="55" ry="58" fill="url(#bodyGrad)" />

          {/* Body highlight */}
          <Path
            d="M 55 110 Q 60 85 100 80 Q 140 85 145 110"
            fill="#A78BFA"
            opacity={0.4}
          />

          {/* Chest badge */}
          <Circle cx="100" cy="155" r="16" fill="#5B21B6" />
          <Circle cx="100" cy="155" r="12" fill="#4C1D95" />
          <Path
            d="M 97 147 L 104 155 L 99 155 L 104 163 L 95 153 L 101 153 Z"
            fill="url(#sparkGrad)"
          />
        </G>

        {/* Arms */}
        <G>
          {/* Left arm */}
          {expression === 'waving' || expression === 'celebrating' ? (
            <G>
              {/* Waving left arm */}
              <Path
                d="M 50 120 Q 25 100 20 70"
                stroke="url(#bodyGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="20" cy="65" r="12" fill="#3B1D6B" />
              <Circle cx="20" cy="65" r="7" fill="#5B21B6" />
              {/* Motion lines */}
              <Path d="M 8 55 L 3 50" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
              <Path d="M 5 65 L -2 65" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
              <Path d="M 8 75 L 3 80" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
            </G>
          ) : (
            <G>
              {/* Normal left arm */}
              <Path
                d="M 50 125 Q 30 140 25 165"
                stroke="url(#bodyGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="25" cy="170" r="12" fill="#3B1D6B" />
              <Circle cx="25" cy="170" r="7" fill="#5B21B6" />
            </G>
          )}

          {/* Right arm */}
          {expression === 'celebrating' ? (
            <G>
              {/* Celebrating right arm (also raised) */}
              <Path
                d="M 150 120 Q 175 100 180 70"
                stroke="url(#bodyGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="180" cy="65" r="12" fill="#3B1D6B" />
              <Circle cx="180" cy="65" r="7" fill="#5B21B6" />
            </G>
          ) : (
            <G>
              {/* Normal right arm */}
              <Path
                d="M 150 125 Q 170 140 175 165"
                stroke="url(#bodyGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx="175" cy="170" r="12" fill="#3B1D6B" />
              <Circle cx="175" cy="170" r="7" fill="#5B21B6" />
            </G>
          )}
        </G>

        {/* Head/Face area */}
        <G>
          {/* Head base */}
          <Circle cx="100" cy="70" r="50" fill="url(#bodyGrad)" />

          {/* Helmet/face plate */}
          <Path
            d="M 55 65 Q 55 30 100 25 Q 145 30 145 65 L 145 85 Q 145 110 100 115 Q 55 110 55 85 Z"
            fill="url(#faceGrad)"
          />

          {/* Face plate border */}
          <Path
            d="M 55 65 Q 55 30 100 25 Q 145 30 145 65 L 145 85 Q 145 110 100 115 Q 55 110 55 85 Z"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="2"
          />

          {/* Eyes */}
          <G>
            {/* Left eye */}
            <Ellipse cx="80" cy="65" rx="15" ry="18" fill="#FFFFFF" />
            <Circle
              cx={expression === 'thinking' ? 76 : expression === 'curious' ? 84 : 80}
              cy={expression === 'thinking' ? 60 : 67}
              r="10"
              fill="#1E293B"
            />
            <Circle
              cx={expression === 'thinking' ? 78 : expression === 'curious' ? 86 : 82}
              cy={expression === 'thinking' ? 57 : 64}
              r="4"
              fill="#FFFFFF"
            />
            <Circle
              cx={expression === 'thinking' ? 74 : expression === 'curious' ? 82 : 78}
              cy={expression === 'thinking' ? 62 : 69}
              r="2"
              fill="#FFFFFF"
              opacity={0.5}
            />

            {/* Right eye */}
            <Ellipse cx="120" cy="65" rx="15" ry="18" fill="#FFFFFF" />
            <Circle
              cx={expression === 'thinking' ? 116 : expression === 'curious' ? 124 : 120}
              cy={expression === 'thinking' ? 60 : 67}
              r="10"
              fill="#1E293B"
            />
            <Circle
              cx={expression === 'thinking' ? 118 : expression === 'curious' ? 126 : 122}
              cy={expression === 'thinking' ? 57 : 64}
              r="4"
              fill="#FFFFFF"
            />
            <Circle
              cx={expression === 'thinking' ? 114 : expression === 'curious' ? 122 : 118}
              cy={expression === 'thinking' ? 62 : 69}
              r="2"
              fill="#FFFFFF"
              opacity={0.5}
            />

            {/* Sparkle eyes for excited/celebrating */}
            {(expression === 'excited' || expression === 'celebrating') && (
              <G>
                <Path d="M 65 52 L 68 58 L 65 64 L 62 58 Z" fill="#FCD34D" />
                <Path d="M 135 52 L 138 58 L 135 64 L 132 58 Z" fill="#FCD34D" />
              </G>
            )}
          </G>

          {/* Rosy cheeks */}
          <Ellipse cx="55" cy="80" rx="10" ry="6" fill="#FDA4AF" opacity={0.6} />
          <Ellipse cx="145" cy="80" rx="10" ry="6" fill="#FDA4AF" opacity={0.6} />

          {/* Eyebrows */}
          {(expression === 'happy' || expression === 'waving' || expression === 'excited' || expression === 'celebrating') && (
            <G>
              <Path d="M 67 48 Q 80 44 92 48" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <Path d="M 108 48 Q 120 44 133 48" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </G>
          )}
          {expression === 'thinking' && (
            <G>
              <Path d="M 65 48 Q 80 42 92 50" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <Path d="M 108 50 Q 120 42 135 48" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </G>
          )}
          {expression === 'curious' && (
            <G>
              <Path d="M 65 50 Q 80 46 92 50" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <Path d="M 108 46 Q 120 42 135 50" stroke="#64748B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </G>
          )}

          {/* Mouth */}
          {expression === 'happy' && (
            <G>
              {/* Open happy mouth */}
              <Path
                d="M 78 88 Q 100 110 122 88"
                fill="#1E293B"
              />
              {/* Tongue */}
              <Ellipse cx="100" cy="100" rx="8" ry="5" fill="#F87171" />
            </G>
          )}
          {expression === 'waving' && (
            <G>
              {/* Open waving mouth */}
              <Path
                d="M 78 88 Q 100 110 122 88"
                fill="#1E293B"
              />
              {/* Tongue */}
              <Ellipse cx="100" cy="100" rx="8" ry="5" fill="#F87171" />
            </G>
          )}
          {(expression === 'excited' || expression === 'celebrating') && (
            <G>
              {/* Wide open excited mouth */}
              <Ellipse cx="100" cy="95" rx="18" ry="14" fill="#1E293B" />
              {/* Tongue */}
              <Ellipse cx="100" cy="100" rx="10" ry="6" fill="#F87171" />
            </G>
          )}
          {expression === 'thinking' && (
            <G>
              <Circle cx="110" cy="95" r="6" fill="none" stroke="#1E293B" strokeWidth="3" />
              {/* Thought bubbles */}
              <Circle cx="145" cy="50" r="5" fill="#E2E8F0" />
              <Circle cx="158" cy="38" r="7" fill="#E2E8F0" />
              <Circle cx="172" cy="25" r="10" fill="#E2E8F0" />
            </G>
          )}
          {expression === 'curious' && (
            <Ellipse cx="100" cy="95" rx="8" ry="10" fill="#1E293B" />
          )}
        </G>

        {/* Ear pieces */}
        <G>
          <Circle cx="48" cy="70" r="12" fill="url(#bodyGrad)" />
          <Circle cx="48" cy="70" r="8" fill="#F1F5F9" />
          <Circle cx="48" cy="70" r="4" fill="#FFFFFF" />

          <Circle cx="152" cy="70" r="12" fill="url(#bodyGrad)" />
          <Circle cx="152" cy="70" r="8" fill="#F1F5F9" />
          <Circle cx="152" cy="70" r="4" fill="#FFFFFF" />
        </G>

        {/* Antenna */}
        <G>
          <Rect x="92" y="5" width="16" height="22" rx="5" fill="#5B21B6" />

          {/* Lightning bolt */}
          <Path
            d="M 96 -8 L 108 8 L 100 8 L 106 22 L 92 5 L 100 5 Z"
            fill="url(#sparkGrad)"
          />

          {/* Glow effect */}
          <Circle cx="100" cy="2" r="8" fill="#FDE047" opacity={0.3} />
        </G>

        {/* Confetti for celebrating */}
        {expression === 'celebrating' && (
          <G>
            <Circle cx="35" cy="30" r="4" fill="#FBBF24" />
            <Circle cx="165" cy="25" r="3" fill="#EC4899" />
            <Circle cx="45" cy="15" r="3" fill="#10B981" />
            <Circle cx="155" cy="15" r="4" fill="#6366F1" />
            <Rect x="25" y="45" width="6" height="6" fill="#F59E0B" transform="rotate(45, 28, 48)" />
            <Rect x="170" y="40" width="5" height="5" fill="#8B5CF6" transform="rotate(30, 172, 42)" />
            <Circle cx="20" cy="60" r="3" fill="#F472B6" />
            <Circle cx="180" cy="55" r="3" fill="#34D399" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// Keep backwards compatibility
export { Sparky as ImprovedMascot };
