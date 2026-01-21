import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Category {
  id: string;
  label: string;
  color: string;
  icon?: string;
}

interface SortItem {
  id: string;
  content: string;
  correctCategory: string;
  explanation: string;
}

interface SortingGameProps {
  title: string;
  instructions: string;
  categories: Category[];
  items: SortItem[];
  onComplete: (results: {
    correct: number;
    total: number;
    itemResults: { itemId: string; wasCorrect: boolean }[];
  }) => void;
}

export function SortingGame({
  title,
  instructions,
  categories,
  items,
  onComplete,
}: SortingGameProps) {
  const [remainingItems, setRemainingItems] = useState(() =>
    [...items].sort(() => Math.random() - 0.5)
  );
  const [sortedItems, setSortedItems] = useState<Record<string, SortItem[]>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, []]))
  );
  const [currentFeedback, setCurrentFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);
  const [results, setResults] = useState<{ itemId: string; wasCorrect: boolean }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleDrop = (item: SortItem, categoryId: string) => {
    const isCorrect = item.correctCategory === categoryId;

    // Add to results
    setResults((prev) => [...prev, { itemId: item.id, wasCorrect: isCorrect }]);

    // Show feedback
    setCurrentFeedback({
      correct: isCorrect,
      explanation: item.explanation,
    });

    if (isCorrect) {
      // Add to category
      setSortedItems((prev) => ({
        ...prev,
        [categoryId]: [...prev[categoryId], item],
      }));
      // Remove from remaining
      setRemainingItems((prev) => prev.filter((i) => i.id !== item.id));
    }

    // Clear feedback after delay
    setTimeout(() => {
      setCurrentFeedback(null);

      // Check if complete
      if (isCorrect && remainingItems.length === 1) {
        setIsComplete(true);
        const finalResults = [...results, { itemId: item.id, wasCorrect: true }];
        onComplete({
          correct: finalResults.filter((r) => r.wasCorrect).length,
          total: items.length,
          itemResults: finalResults,
        });
      }
    }, 2000);
  };

  const correctCount = results.filter((r) => r.wasCorrect).length;

  if (isComplete) {
    const allCorrectFirstTry = results.every((r) => r.wasCorrect);
    return (
      <View className="flex-1 bg-slate-50 p-6">
        <View className="flex-1 items-center justify-center">
          {/* Celebration */}
          <View className="mb-6">
            {allCorrectFirstTry ? (
              <View className="w-24 h-24 bg-amber-100 rounded-full items-center justify-center">
                <Text className="text-5xl">🌟</Text>
              </View>
            ) : (
              <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center">
                <Text className="text-5xl">✓</Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-slate-800 mb-2 text-center">
            {allCorrectFirstTry ? 'Perfect!' : 'Great Job!'}
          </Text>

          <Text className="text-slate-600 text-center mb-4">
            You sorted {items.length} items correctly!
          </Text>

          {/* Show sorted categories */}
          <View className="w-full">
            {categories.map((category) => (
              <View
                key={category.id}
                className="bg-white rounded-xl p-4 mb-3"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: category.color,
                }}
              >
                <Text
                  className="font-bold mb-2"
                  style={{ color: category.color }}
                >
                  {category.label}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {sortedItems[category.id].map((item) => (
                    <View
                      key={item.id}
                      className="bg-slate-100 px-3 py-1 rounded-full"
                    >
                      <Text className="text-slate-700 text-sm">{item.content}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-xl font-bold text-slate-800">{title}</Text>
        <Text className="text-slate-600 mt-1">{instructions}</Text>
      </View>

      {/* Progress */}
      <View className="px-6 py-2">
        <View className="flex-row items-center">
          <View className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${((items.length - remainingItems.length) / items.length) * 100}%`,
              }}
            />
          </View>
          <Text className="ml-3 text-slate-600 text-sm font-bold">
            {items.length - remainingItems.length}/{items.length}
          </Text>
        </View>
      </View>

      {/* Drop zones at top for visibility */}
      <View className="px-6 py-3">
        <View className="flex-row gap-3">
          {categories.map((category) => (
            <View
              key={category.id}
              className="flex-1 rounded-xl p-3"
              style={{
                backgroundColor: `${category.color}15`,
                borderWidth: 2,
                borderColor: `${category.color}60`,
              }}
            >
              <View className="flex-row items-center justify-center mb-2">
                <Text className="text-lg mr-2">
                  {category.id === 'ai' || category.id === 'ai-better' ? '🤖' : '❌'}
                </Text>
                <Text
                  className="font-bold text-sm"
                  style={{ color: category.color }}
                >
                  {category.label}
                </Text>
              </View>

              {/* Sorted items count */}
              <View className="items-center">
                <Text className="text-slate-500 text-xs">
                  {sortedItems[category.id].length} sorted
                </Text>
              </View>

              {/* Show sorted items as small chips */}
              {sortedItems[category.id].length > 0 && (
                <View className="flex-row flex-wrap gap-1 mt-2 justify-center">
                  {sortedItems[category.id].slice(0, 4).map((item) => (
                    <View
                      key={item.id}
                      className="bg-white/80 px-2 py-1 rounded-md"
                    >
                      <Text className="text-xs text-slate-600" numberOfLines={1}>
                        {item.content.substring(0, 15)}...
                      </Text>
                    </View>
                  ))}
                  {sortedItems[category.id].length > 4 && (
                    <Text className="text-xs text-slate-400">
                      +{sortedItems[category.id].length - 4} more
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Current item to sort */}
      {remainingItems.length > 0 && (
        <View className="px-6 py-4 flex-1">
          <Text className="text-center text-slate-500 text-sm mb-3">
            Tap the correct category for:
          </Text>
          <DraggableItem
            key={remainingItems[0].id}
            item={remainingItems[0]}
            categories={categories}
            onDrop={handleDrop}
          />

          {/* Remaining items preview */}
          {remainingItems.length > 1 && (
            <View className="mt-4 items-center">
              <Text className="text-slate-400 text-sm">
                {remainingItems.length - 1} more items remaining
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Feedback overlay */}
      {currentFeedback && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center p-6">
          <View
            className={`bg-white rounded-2xl p-6 max-w-sm w-full ${
              currentFeedback.correct ? 'border-green-500' : 'border-red-500'
            }`}
            style={{ borderWidth: 3 }}
          >
            <View className="items-center mb-4">
              {currentFeedback.correct ? (
                <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center">
                  <CheckIcon />
                </View>
              ) : (
                <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center">
                  <XIcon />
                </View>
              )}
            </View>
            <Text
              className={`text-xl font-bold text-center mb-2 ${
                currentFeedback.correct ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {currentFeedback.correct ? 'Correct!' : 'Try Again!'}
            </Text>
            <Text className="text-slate-600 text-center">
              {currentFeedback.explanation}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function DraggableItem({
  item,
  categories,
  onDrop,
}: {
  item: SortItem;
  categories: Category[];
  onDrop: (item: SortItem, categoryId: string) => void;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={() => {
        // For simplicity, show a selection UI
        // In a full implementation, this would be a drag-and-drop
      }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`bg-white rounded-xl px-4 py-3 ${
        isPressed ? 'scale-105' : ''
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isPressed ? 0.15 : 0.08,
        shadowRadius: isPressed ? 8 : 4,
        elevation: isPressed ? 6 : 3,
        transform: [{ scale: isPressed ? 1.02 : 1 }],
      }}
    >
      <Text className="text-slate-800 font-medium">{item.content}</Text>

      {/* Category selection buttons */}
      <View className="flex-row gap-3 mt-3">
        {categories.map((category, index) => {
          // Use distinct colors for better visual appeal
          const isAiCategory = category.id === 'ai' || category.id === 'ai-better';
          const bgColor = isAiCategory ? '#818CF8' : '#F472B6'; // Indigo vs Pink
          const icon = isAiCategory ? '🤖' : '❌';

          return (
            <Pressable
              key={category.id}
              onPress={() => onDrop(item, category.id)}
              className="flex-1 rounded-xl py-3 items-center flex-row justify-center"
              style={{
                backgroundColor: bgColor,
                shadowColor: bgColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="mr-2">{icon}</Text>
              <Text className="text-white font-bold">
                {isAiCategory ? 'Uses AI' : 'No AI'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
}

function CheckIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke="#10B981"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function XIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke="#EF4444"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
