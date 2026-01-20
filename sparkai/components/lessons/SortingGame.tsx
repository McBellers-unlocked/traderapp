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
          <View className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${((items.length - remainingItems.length) / items.length) * 100}%`,
              }}
            />
          </View>
          <Text className="ml-3 text-slate-500 text-sm font-medium">
            {items.length - remainingItems.length}/{items.length}
          </Text>
        </View>
      </View>

      {/* Items to sort */}
      <View className="px-6 py-4">
        <View className="flex-row flex-wrap gap-3">
          {remainingItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              categories={categories}
              onDrop={handleDrop}
            />
          ))}
        </View>
      </View>

      {/* Drop zones */}
      <View className="flex-1 px-6 pb-6">
        <View className="flex-row gap-4 flex-1">
          {categories.map((category) => (
            <View
              key={category.id}
              className="flex-1 rounded-2xl p-4 min-h-[200px]"
              style={{
                backgroundColor: `${category.color}15`,
                borderWidth: 2,
                borderColor: `${category.color}40`,
                borderStyle: 'dashed',
              }}
            >
              <View className="items-center mb-3">
                {category.icon && (
                  <Text className="text-2xl mb-1">{category.icon}</Text>
                )}
                <Text
                  className="font-bold text-center"
                  style={{ color: category.color }}
                >
                  {category.label}
                </Text>
              </View>

              {/* Sorted items */}
              <View className="gap-2">
                {sortedItems[category.id].map((item) => (
                  <View
                    key={item.id}
                    className="bg-white rounded-lg px-3 py-2"
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: category.color,
                    }}
                  >
                    <Text className="text-slate-700 text-sm">{item.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

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
      <View className="flex-row gap-2 mt-3">
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onDrop(item, category.id)}
            className="flex-1 rounded-lg py-2 items-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: category.color }}
            >
              {category.label.split(' ')[0]}
            </Text>
          </Pressable>
        ))}
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
