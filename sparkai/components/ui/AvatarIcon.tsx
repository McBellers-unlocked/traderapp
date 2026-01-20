import { View } from 'react-native';
import Svg, { Circle, Path, G, Ellipse, Rect } from 'react-native-svg';

type AvatarType = 'sparky' | 'bolt' | 'nova' | 'astro' | 'brainiac' | 'idea';

interface AvatarIconProps {
  type: AvatarType;
  size?: number;
  selected?: boolean;
}

export function AvatarIcon({ type, size = 64, selected = false }: AvatarIconProps) {
  const scale = size / 64;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: selected ? '#EEF2FF' : '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: selected ? 3 : 0,
        borderColor: '#6366F1',
      }}
    >
      <Svg width={size * 0.75} height={size * 0.75} viewBox="0 0 64 64">
        {type === 'sparky' && <SparkyAvatar />}
        {type === 'bolt' && <BoltAvatar />}
        {type === 'nova' && <NovaAvatar />}
        {type === 'astro' && <AstroAvatar />}
        {type === 'brainiac' && <BrainiacAvatar />}
        {type === 'idea' && <IdeaAvatar />}
      </Svg>
    </View>
  );
}

// Sparky - Friendly robot
function SparkyAvatar() {
  return (
    <G>
      {/* Head */}
      <Circle cx="32" cy="32" r="24" fill="#818CF8" />
      <Circle cx="32" cy="30" r="20" fill="#A5B4FC" />
      {/* Face plate */}
      <Ellipse cx="32" cy="32" rx="14" ry="12" fill="#F8FAFC" />
      {/* Eyes */}
      <Circle cx="26" cy="30" r="4" fill="#1E293B" />
      <Circle cx="38" cy="30" r="4" fill="#1E293B" />
      <Circle cx="27" cy="29" r="1.5" fill="#FFF" />
      <Circle cx="39" cy="29" r="1.5" fill="#FFF" />
      {/* Smile */}
      <Path d="M26 36 Q32 42 38 36" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Antenna */}
      <Path d="M32 8 L32 14" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
      <Circle cx="32" cy="6" r="4" fill="#FBBF24" />
      {/* Ears */}
      <Circle cx="8" cy="32" r="4" fill="#818CF8" />
      <Circle cx="56" cy="32" r="4" fill="#818CF8" />
      {/* Cheeks */}
      <Ellipse cx="20" cy="36" rx="3" ry="2" fill="#FCA5A5" opacity="0.5" />
      <Ellipse cx="44" cy="36" rx="3" ry="2" fill="#FCA5A5" opacity="0.5" />
    </G>
  );
}

// Bolt - Electric character
function BoltAvatar() {
  return (
    <G>
      {/* Head */}
      <Circle cx="32" cy="32" r="24" fill="#FBBF24" />
      <Circle cx="32" cy="30" r="20" fill="#FCD34D" />
      {/* Face */}
      <Ellipse cx="32" cy="32" rx="14" ry="12" fill="#FEF3C7" />
      {/* Eyes - excited */}
      <Path d="M24 28 L28 32 L24 36" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M40 28 L36 32 L40 36" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Big smile */}
      <Ellipse cx="32" cy="38" rx="6" ry="4" fill="#1E293B" />
      {/* Lightning bolts */}
      <Path d="M12 18 L16 24 L12 24 L18 32" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M52 18 L48 24 L52 24 L46 32" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Spiky hair */}
      <Path d="M20 12 L24 6 L28 14" fill="#FBBF24" />
      <Path d="M28 10 L32 2 L36 10" fill="#FBBF24" />
      <Path d="M36 12 L40 6 L44 14" fill="#FBBF24" />
    </G>
  );
}

// Nova - Star character
function NovaAvatar() {
  return (
    <G>
      {/* Glow */}
      <Circle cx="32" cy="32" r="26" fill="#FDE68A" opacity="0.5" />
      {/* Head */}
      <Circle cx="32" cy="32" r="22" fill="#F472B6" />
      <Circle cx="32" cy="30" r="18" fill="#F9A8D4" />
      {/* Face */}
      <Ellipse cx="32" cy="32" rx="12" ry="10" fill="#FDF2F8" />
      {/* Sparkling eyes */}
      <Circle cx="27" cy="30" r="3.5" fill="#1E293B" />
      <Circle cx="37" cy="30" r="3.5" fill="#1E293B" />
      <Circle cx="28" cy="29" r="1.5" fill="#FFF" />
      <Circle cx="38" cy="29" r="1.5" fill="#FFF" />
      {/* Happy mouth */}
      <Path d="M28 36 Q32 40 36 36" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Stars around */}
      <Path d="M10 16 L12 12 L14 16 L10 14 L14 14 Z" fill="#FBBF24" />
      <Path d="M50 16 L52 12 L54 16 L50 14 L54 14 Z" fill="#FBBF24" />
      <Path d="M8 44 L10 40 L12 44 L8 42 L12 42 Z" fill="#FBBF24" />
      <Path d="M52 44 L54 40 L56 44 L52 42 L56 42 Z" fill="#FBBF24" />
      {/* Blush */}
      <Ellipse cx="21" cy="34" rx="3" ry="2" fill="#F472B6" opacity="0.6" />
      <Ellipse cx="43" cy="34" rx="3" ry="2" fill="#F472B6" opacity="0.6" />
    </G>
  );
}

// Astro - Astronaut character
function AstroAvatar() {
  return (
    <G>
      {/* Helmet outline */}
      <Circle cx="32" cy="32" r="26" fill="#475569" />
      <Circle cx="32" cy="32" r="23" fill="#64748B" />
      {/* Visor */}
      <Circle cx="32" cy="32" r="18" fill="#0EA5E9" />
      <Circle cx="32" cy="30" r="15" fill="#38BDF8" />
      {/* Visor reflection */}
      <Ellipse cx="26" cy="26" rx="4" ry="3" fill="#BAE6FD" opacity="0.7" />
      {/* Face behind visor */}
      <Ellipse cx="32" cy="34" rx="10" ry="9" fill="#FED7AA" />
      {/* Eyes */}
      <Circle cx="28" cy="32" r="2.5" fill="#1E293B" />
      <Circle cx="36" cy="32" r="2.5" fill="#1E293B" />
      <Circle cx="29" cy="31" r="1" fill="#FFF" />
      <Circle cx="37" cy="31" r="1" fill="#FFF" />
      {/* Smile */}
      <Path d="M29 38 Q32 41 35 38" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Helmet details */}
      <Circle cx="12" cy="32" r="3" fill="#475569" />
      <Circle cx="52" cy="32" r="3" fill="#475569" />
      <Rect x="30" y="4" width="4" height="6" rx="2" fill="#EF4444" />
    </G>
  );
}

// Brainiac - Smart character
function BrainiacAvatar() {
  return (
    <G>
      {/* Head */}
      <Ellipse cx="32" cy="34" rx="22" ry="24" fill="#A78BFA" />
      <Ellipse cx="32" cy="32" rx="19" ry="21" fill="#C4B5FD" />
      {/* Brain pattern on top */}
      <Path d="M20 18 Q24 14 28 18 Q32 14 36 18 Q40 14 44 18" stroke="#8B5CF6" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M22 12 Q28 8 34 12 Q40 8 42 12" stroke="#8B5CF6" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Face */}
      <Ellipse cx="32" cy="36" rx="13" ry="11" fill="#F5F3FF" />
      {/* Glasses */}
      <Circle cx="26" cy="34" r="6" fill="none" stroke="#1E293B" strokeWidth="2" />
      <Circle cx="38" cy="34" r="6" fill="none" stroke="#1E293B" strokeWidth="2" />
      <Path d="M32 34 L32 34" stroke="#1E293B" strokeWidth="2" />
      <Path d="M20 34 L14 32" stroke="#1E293B" strokeWidth="2" />
      <Path d="M44 34 L50 32" stroke="#1E293B" strokeWidth="2" />
      {/* Eyes behind glasses */}
      <Circle cx="26" cy="34" r="2" fill="#1E293B" />
      <Circle cx="38" cy="34" r="2" fill="#1E293B" />
      {/* Thinking smile */}
      <Path d="M28 44 Q32 46 36 44" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
    </G>
  );
}

// Idea - Lightbulb character
function IdeaAvatar() {
  return (
    <G>
      {/* Glow effect */}
      <Circle cx="32" cy="28" r="26" fill="#FEF3C7" opacity="0.6" />
      {/* Bulb head */}
      <Circle cx="32" cy="26" r="20" fill="#FBBF24" />
      <Circle cx="32" cy="24" r="17" fill="#FCD34D" />
      {/* Shine */}
      <Ellipse cx="24" cy="20" rx="4" ry="6" fill="#FEF3C7" opacity="0.8" />
      {/* Face */}
      <Ellipse cx="32" cy="28" rx="11" ry="9" fill="#FFFBEB" />
      {/* Eyes */}
      <Circle cx="27" cy="26" r="3" fill="#1E293B" />
      <Circle cx="37" cy="26" r="3" fill="#1E293B" />
      <Circle cx="28" cy="25" r="1.2" fill="#FFF" />
      <Circle cx="38" cy="25" r="1.2" fill="#FFF" />
      {/* Happy surprised mouth */}
      <Ellipse cx="32" cy="34" rx="4" ry="3" fill="#1E293B" />
      {/* Base of bulb */}
      <Rect x="26" y="46" width="12" height="4" rx="1" fill="#94A3B8" />
      <Rect x="27" y="50" width="10" height="3" rx="1" fill="#64748B" />
      <Rect x="28" y="53" width="8" height="3" rx="1" fill="#475569" />
      {/* Idea sparkles */}
      <Path d="M8 14 L10 10 L12 14 L8 12 L12 12 Z" fill="#FBBF24" />
      <Path d="M52 14 L54 10 L56 14 L52 12 L56 12 Z" fill="#FBBF24" />
      <Path d="M6 28 L8 24 L10 28 L6 26 L10 26 Z" fill="#FBBF24" />
      <Path d="M54 28 L56 24 L58 28 L54 26 L58 26 Z" fill="#FBBF24" />
    </G>
  );
}

// Map avatar IDs to types
export const AVATAR_TYPE_MAP: Record<string, AvatarType> = {
  'robot-1': 'sparky',
  'robot-2': 'bolt',
  'star-1': 'nova',
  'rocket-1': 'astro',
  'brain-1': 'brainiac',
  'lightbulb-1': 'idea',
};

export function getAvatarType(avatarId: string): AvatarType {
  return AVATAR_TYPE_MAP[avatarId] || 'sparky';
}
