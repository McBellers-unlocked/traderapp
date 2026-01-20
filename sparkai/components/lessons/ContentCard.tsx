import { View, Text, Image } from 'react-native';
import { Mascot } from '@/components/ui/Mascot';

interface ContentCardProps {
  type: 'text' | 'text-image' | 'fact' | 'tip' | 'warning';
  title?: string;
  content: string;
  media?: {
    type: 'image';
    url: string;
    alt: string;
    position?: 'top' | 'left' | 'right';
  };
  mascot?: {
    show: boolean;
    expression: 'happy' | 'thinking' | 'excited' | 'waving';
    speech?: string;
  };
  icon?: string;
  accentColor?: string;
}

export function ContentCard({
  type,
  title,
  content,
  media,
  mascot,
  icon,
  accentColor,
}: ContentCardProps) {
  // Fact card style
  if (type === 'fact') {
    return (
      <View
        className="bg-amber-50 rounded-2xl p-5 border border-amber-200"
        style={{
          shadowColor: '#F59E0B',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl mr-2">{icon || '💡'}</Text>
          <Text className="text-amber-700 font-bold text-lg">Fun Fact!</Text>
        </View>
        <Text className="text-amber-800 leading-relaxed text-base">
          {content}
        </Text>
      </View>
    );
  }

  // Tip card style
  if (type === 'tip') {
    return (
      <View
        className="bg-blue-50 rounded-2xl p-5 border border-blue-200"
        style={{
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl mr-2">{icon || '✨'}</Text>
          <Text className="text-blue-700 font-bold text-lg">Pro Tip</Text>
        </View>
        <Text className="text-blue-800 leading-relaxed text-base">
          {content}
        </Text>
      </View>
    );
  }

  // Warning card style
  if (type === 'warning') {
    return (
      <View
        className="bg-red-50 rounded-2xl p-5 border border-red-200"
        style={{
          shadowColor: '#EF4444',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center mb-3">
          <Text className="text-2xl mr-2">{icon || '⚠️'}</Text>
          <Text className="text-red-700 font-bold text-lg">Important!</Text>
        </View>
        <Text className="text-red-800 leading-relaxed text-base">
          {content}
        </Text>
      </View>
    );
  }

  // Mascot speech card
  if (mascot?.show && mascot.speech) {
    return (
      <View className="flex-row items-start">
        <View className="mr-4">
          <Mascot size="md" expression={mascot.expression} showGlow={false} />
        </View>
        <View className="flex-1">
          <View
            className="bg-white rounded-2xl p-4 relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Speech bubble pointer */}
            <View
              style={{
                position: 'absolute',
                left: -10,
                top: 20,
                width: 0,
                height: 0,
                borderTopWidth: 10,
                borderTopColor: 'transparent',
                borderBottomWidth: 10,
                borderBottomColor: 'transparent',
                borderRightWidth: 12,
                borderRightColor: 'white',
              }}
            />
            <Text className="text-slate-700 leading-relaxed text-base">
              {mascot.speech}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Text with image
  if (type === 'text-image' && media) {
    const isHorizontal = media.position === 'left' || media.position === 'right';

    if (isHorizontal) {
      return (
        <View
          className="bg-white rounded-2xl p-5 flex-row"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
            flexDirection: media.position === 'right' ? 'row' : 'row-reverse',
          }}
        >
          <View className="flex-1">
            {title && (
              <Text className="text-xl font-bold text-slate-800 mb-3">
                {title}
              </Text>
            )}
            <Text className="text-slate-600 leading-relaxed text-base">
              {content}
            </Text>
          </View>
          <View className={media.position === 'right' ? 'ml-4' : 'mr-4'}>
            <Image
              source={{ uri: media.url }}
              className="w-24 h-24 rounded-xl"
              accessibilityLabel={media.alt}
            />
          </View>
        </View>
      );
    }

    // Image on top
    return (
      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Image
          source={{ uri: media.url }}
          className="w-full h-48"
          accessibilityLabel={media.alt}
        />
        <View className="p-5">
          {title && (
            <Text className="text-xl font-bold text-slate-800 mb-3">
              {title}
            </Text>
          )}
          <Text className="text-slate-600 leading-relaxed text-base">
            {content}
          </Text>
        </View>
      </View>
    );
  }

  // Default text card with mascot
  if (mascot?.show) {
    return (
      <View
        className="bg-white rounded-2xl p-5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="items-center mb-4">
          <Mascot size="md" expression={mascot.expression} showGlow={false} />
        </View>
        {title && (
          <Text className="text-xl font-bold text-slate-800 mb-3 text-center">
            {title}
          </Text>
        )}
        <Text className="text-slate-600 leading-relaxed text-base text-center">
          {content}
        </Text>
      </View>
    );
  }

  // Simple text card
  return (
    <View
      className="bg-white rounded-2xl p-5"
      style={{
        shadowColor: accentColor || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: accentColor ? 0.15 : 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: accentColor ? 4 : 0,
        borderLeftColor: accentColor,
      }}
    >
      {title && (
        <Text
          className="text-xl font-bold mb-3"
          style={{ color: accentColor || '#1E293B' }}
        >
          {title}
        </Text>
      )}
      <Text className="text-slate-600 leading-relaxed text-base">{content}</Text>
    </View>
  );
}

// Content with bullet points
export function ContentList({
  title,
  items,
  icon = '•',
  accentColor,
}: {
  title?: string;
  items: string[];
  icon?: string;
  accentColor?: string;
}) {
  return (
    <View
      className="bg-white rounded-2xl p-5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {title && (
        <Text className="text-xl font-bold text-slate-800 mb-4">{title}</Text>
      )}
      <View className="gap-3">
        {items.map((item, index) => (
          <View key={index} className="flex-row items-start">
            <Text
              className="mr-3 text-lg"
              style={{ color: accentColor || '#6366F1' }}
            >
              {icon}
            </Text>
            <Text className="flex-1 text-slate-600 leading-relaxed">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Comparison card (AI vs Humans style)
export function ComparisonCard({
  title,
  leftLabel,
  rightLabel,
  leftItems,
  rightItems,
  leftColor = '#3B82F6',
  rightColor = '#EC4899',
}: {
  title?: string;
  leftLabel: string;
  rightLabel: string;
  leftItems: string[];
  rightItems: string[];
  leftColor?: string;
  rightColor?: string;
}) {
  return (
    <View
      className="bg-white rounded-2xl p-5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {title && (
        <Text className="text-xl font-bold text-slate-800 mb-4 text-center">
          {title}
        </Text>
      )}
      <View className="flex-row gap-4">
        {/* Left column */}
        <View className="flex-1">
          <View
            className="rounded-xl p-3 mb-3"
            style={{ backgroundColor: `${leftColor}15` }}
          >
            <Text
              className="font-bold text-center"
              style={{ color: leftColor }}
            >
              {leftLabel}
            </Text>
          </View>
          <View className="gap-2">
            {leftItems.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center bg-slate-50 rounded-lg p-2"
              >
                <Text style={{ color: leftColor }} className="mr-2">
                  ✓
                </Text>
                <Text className="text-slate-700 text-sm flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right column */}
        <View className="flex-1">
          <View
            className="rounded-xl p-3 mb-3"
            style={{ backgroundColor: `${rightColor}15` }}
          >
            <Text
              className="font-bold text-center"
              style={{ color: rightColor }}
            >
              {rightLabel}
            </Text>
          </View>
          <View className="gap-2">
            {rightItems.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center bg-slate-50 rounded-lg p-2"
              >
                <Text style={{ color: rightColor }} className="mr-2">
                  ✓
                </Text>
                <Text className="text-slate-700 text-sm flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
