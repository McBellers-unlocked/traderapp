import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface CookbookCreatorProps {
  title: string;
  recipeTypes: string[];
  canGenerateInstructions?: boolean;
  canAddNutrition?: boolean;
  canCreateShoppingList?: boolean;
  onComplete?: () => void;
  onSave?: (recipe: any) => void;
}

interface RecipeData {
  type: string;
  name: string;
  description: string;
  servings: string;
  prepTime: string;
  ingredients: string[];
  specialInstructions: string;
}

interface GeneratedRecipe {
  instructions: string[];
  tips: string[];
  funFacts: string[];
  shoppingList: string[];
  nutritionInfo: string;
}

export function CookbookCreator({
  title,
  recipeTypes,
  canGenerateInstructions = true,
  canAddNutrition = true,
  canCreateShoppingList = true,
  onComplete,
  onSave,
}: CookbookCreatorProps) {
  const [step, setStep] = useState<'type' | 'details' | 'ingredients' | 'generating' | 'recipe'>('type');
  const [recipe, setRecipe] = useState<RecipeData>({
    type: '',
    name: '',
    description: '',
    servings: '4',
    prepTime: '30',
    ingredients: ['', '', '', '', ''],
    specialInstructions: '',
  });
  const [generated, setGenerated] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showShopping, setShowShopping] = useState(false);

  const recipeInfo: Record<string, { emoji: string; desc: string; examples: string[] }> = {
    'breakfast': {
      emoji: '🍳',
      desc: 'Start the day deliciously!',
      examples: ['Pancakes', 'Smoothie Bowl', 'Breakfast Burrito'],
    },
    'lunch': {
      emoji: '🥪',
      desc: 'Perfect midday meals!',
      examples: ['Sandwiches', 'Salads', 'Wraps'],
    },
    'dinner': {
      emoji: '🍝',
      desc: 'Family dinner favorites!',
      examples: ['Pasta', 'Stir-fry', 'Tacos'],
    },
    'snacks': {
      emoji: '🍿',
      desc: 'Tasty treats anytime!',
      examples: ['Trail Mix', 'Fruit Cups', 'Mini Pizzas'],
    },
    'desserts': {
      emoji: '🍪',
      desc: 'Sweet endings!',
      examples: ['Cookies', 'Brownies', 'Fruit Parfait'],
    },
    'drinks': {
      emoji: '🥤',
      desc: 'Refreshing beverages!',
      examples: ['Lemonade', 'Smoothies', 'Hot Cocoa'],
    },
  };

  const updateRecipe = (field: keyof RecipeData, value: string | string[]) => {
    setRecipe({ ...recipe, [field]: value });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    updateRecipe('ingredients', newIngredients);
  };

  const addIngredient = () => {
    updateRecipe('ingredients', [...recipe.ingredients, '']);
  };

  const generateRecipe = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const ingredients = recipe.ingredients.filter(i => i.trim());

      // Generate instructions based on recipe type and ingredients
      const instructions = [
        `Gather all your ingredients and equipment. Make sure you have a clean workspace!`,
        `Prepare your ingredients: wash produce, measure out portions, and pre-cut anything that needs cutting.`,
        ingredients.length > 0
          ? `Start with your ${ingredients[0].toLowerCase()} - this is the star of the dish!`
          : `Start by preparing your main ingredient.`,
        ingredients.length > 1
          ? `Add the ${ingredients.slice(1, 3).join(' and ')} and mix well.`
          : `Add your secondary ingredients and combine thoroughly.`,
        `Cook or prepare according to your timing (about ${recipe.prepTime} minutes total).`,
        `Taste and adjust seasoning if needed - chefs always taste their food!`,
        `Plate your creation beautifully - we eat with our eyes first!`,
        `Serve your ${recipe.name} with a smile! 😊`,
      ];

      const tips = [
        '👨‍🍳 Always wash your hands before cooking!',
        '🔪 Ask an adult to help with sharp knives and hot stoves.',
        '📏 Measuring ingredients carefully makes a big difference!',
        '🧹 Clean as you go to make cleanup easier.',
        '🎨 Have fun and be creative - cooking is an art!',
      ];

      const funFacts = [
        `Did you know? ${recipe.type === 'breakfast' ? 'Breakfast is called "breakfast" because you\'re "breaking" your overnight "fast"!' : ''}`,
        `Cooking tip: ${recipe.type === 'desserts' ? 'Room temperature eggs make fluffier cakes!' : 'Letting meat rest after cooking keeps it juicy!'}`,
        `Fun fact: Chefs wear tall hats (called "toques") - the folds represent the different ways they can cook eggs!`,
      ];

      const shoppingList = ingredients.map((ing, i) => {
        const amounts = ['1 cup', '2 tbsp', '1/2 lb', '3 pieces', '1 package'];
        return `${amounts[i % amounts.length]} ${ing}`;
      });

      const nutritionInfo = `
🥗 Nutrition Facts (per serving)
━━━━━━━━━━━━━━━━━━━━━━
Servings: ${recipe.servings}
Prep Time: ${recipe.prepTime} mins

Estimated Values:
• Calories: ${Math.floor(Math.random() * 300 + 150)} kcal
• Protein: ${Math.floor(Math.random() * 20 + 5)}g
• Carbs: ${Math.floor(Math.random() * 40 + 10)}g
• Fat: ${Math.floor(Math.random() * 15 + 3)}g
• Fiber: ${Math.floor(Math.random() * 8 + 1)}g

💡 Tip: Add more veggies for extra nutrition!
      `;

      setGenerated({
        instructions,
        tips,
        funFacts,
        shoppingList,
        nutritionInfo,
      });

      setStep('recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave?.({
      ...recipe,
      generated,
    });
  };

  const canProceed = () => {
    if (step === 'details') {
      return recipe.name.trim() && recipe.description.trim();
    }
    if (step === 'ingredients') {
      return recipe.ingredients.filter(i => i.trim()).length >= 3;
    }
    return true;
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">👨‍🍳</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Progress */}
        {step !== 'recipe' && step !== 'generating' && (
          <View className="flex-row justify-center gap-2 mb-4">
            {['type', 'details', 'ingredients'].map((s, index) => (
              <View
                key={s}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  step === s
                    ? 'bg-orange-500'
                    : ['type', 'details', 'ingredients'].indexOf(step) > index
                    ? 'bg-green-500'
                    : 'bg-slate-200'
                }`}
              >
                <Text className={`text-xs font-bold ${
                  ['type', 'details', 'ingredients'].indexOf(step) >= index ? 'text-white' : 'text-slate-500'
                }`}>
                  {['type', 'details', 'ingredients'].indexOf(step) > index ? '✓' : index + 1}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Step 1: Recipe Type */}
        {step === 'type' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of recipe will you create?
            </Text>

            <View className="gap-3">
              {recipeTypes.map((type) => {
                const info = recipeInfo[type];
                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      updateRecipe('type', type);
                      setStep('details');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                  >
                    <Text className="text-3xl mr-4">{info?.emoji || '🍽️'}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800 capitalize text-lg">{type}</Text>
                      <Text className="text-slate-500 text-sm">{info?.desc}</Text>
                      <Text className="text-slate-400 text-xs mt-1">
                        e.g., {info?.examples.join(', ')}
                      </Text>
                    </View>
                    <Text className="text-orange-500">→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Recipe Details */}
        {step === 'details' && (
          <View>
            <View className="bg-orange-500 rounded-2xl p-4 mb-4">
              <Text className="text-3xl text-center mb-1">
                {recipeInfo[recipe.type]?.emoji}
              </Text>
              <Text className="text-white text-xl font-bold text-center capitalize">
                {recipe.type} Recipe
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Recipe Name:</Text>
              <TextInput
                className="border-2 border-orange-200 rounded-xl p-3 bg-orange-50 text-lg"
                placeholder="My Amazing Pancakes"
                value={recipe.name}
                onChangeText={(val) => updateRecipe('name', val)}
              />
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Description:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[80px]"
                placeholder="Fluffy, golden pancakes perfect for lazy Sunday mornings..."
                value={recipe.description}
                onChangeText={(val) => updateRecipe('description', val)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                <Text className="font-semibold text-slate-700 mb-2">Servings:</Text>
                <TextInput
                  className="border-2 border-slate-200 rounded-lg p-2 bg-slate-50 text-center"
                  placeholder="4"
                  value={recipe.servings}
                  onChangeText={(val) => updateRecipe('servings', val)}
                  keyboardType="number-pad"
                />
              </View>
              <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                <Text className="font-semibold text-slate-700 mb-2">Prep Time:</Text>
                <TextInput
                  className="border-2 border-slate-200 rounded-lg p-2 bg-slate-50 text-center"
                  placeholder="30 mins"
                  value={recipe.prepTime}
                  onChangeText={(val) => updateRecipe('prepTime', val)}
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('type')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Add Ingredients →"
                  onPress={() => setStep('ingredients')}
                  disabled={!canProceed()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Ingredients */}
        {step === 'ingredients' && (
          <View>
            <View className="bg-green-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                🥗 Add Your Ingredients
              </Text>
              <Text className="text-green-100 text-center mt-1">
                List at least 3 ingredients
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} className="mb-3">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2">
                      <Text className="text-green-600 font-bold text-sm">{index + 1}</Text>
                    </View>
                    <TextInput
                      className="flex-1 border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                      placeholder={`Ingredient ${index + 1} (e.g., 2 cups flour)`}
                      value={ingredient}
                      onChangeText={(val) => updateIngredient(index, val)}
                    />
                  </View>
                </View>
              ))}

              <Pressable
                onPress={addIngredient}
                className="flex-row items-center justify-center py-3 border-2 border-dashed border-green-300 rounded-xl"
              >
                <Text className="text-green-600 font-medium">+ Add Another Ingredient</Text>
              </Pressable>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                Special Instructions (optional):
              </Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[60px]"
                placeholder="Any dietary needs or preferences? (nut-free, vegetarian, etc.)"
                value={recipe.specialInstructions}
                onChangeText={(val) => updateRecipe('specialInstructions', val)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('details')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Create Recipe! 🍳"
                  onPress={generateRecipe}
                  disabled={!canProceed()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#F97316" />
            <Text className="text-xl font-bold text-orange-600 mt-6">
              Creating your recipe...
            </Text>
            <Text className="text-slate-500 mt-2">Writing instructions & tips!</Text>
          </View>
        )}

        {/* Recipe Result */}
        {step === 'recipe' && generated && (
          <View>
            {/* Recipe Card Header */}
            <View className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-1 mb-4">
              <View className="bg-white rounded-xl p-4">
                <View className="items-center mb-4">
                  <Text className="text-4xl">{recipeInfo[recipe.type]?.emoji}</Text>
                  <Text className="text-2xl font-black text-slate-800 mt-2">{recipe.name}</Text>
                  <Text className="text-slate-600 italic text-center">{recipe.description}</Text>
                </View>

                <View className="flex-row justify-center gap-4">
                  <View className="items-center">
                    <Text className="text-xl">👥</Text>
                    <Text className="text-slate-600 text-sm">{recipe.servings} servings</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xl">⏱️</Text>
                    <Text className="text-slate-600 text-sm">{recipe.prepTime} mins</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Ingredients */}
            <View className="bg-green-50 rounded-2xl p-4 mb-4">
              <Text className="font-bold text-green-800 mb-3 text-lg">🥗 Ingredients</Text>
              {recipe.ingredients.filter(i => i.trim()).map((ing, i) => (
                <View key={i} className="flex-row items-center mb-2">
                  <Text className="text-green-600 mr-2">•</Text>
                  <Text className="text-green-700">{ing}</Text>
                </View>
              ))}
            </View>

            {/* Instructions */}
            {canGenerateInstructions && (
              <View className="bg-blue-50 rounded-2xl p-4 mb-4">
                <Text className="font-bold text-blue-800 mb-3 text-lg">📝 Instructions</Text>
                {generated.instructions.map((inst, i) => (
                  <View key={i} className="flex-row mb-3">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Text className="text-white text-xs font-bold">{i + 1}</Text>
                    </View>
                    <Text className="flex-1 text-blue-700">{inst}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tips */}
            <View className="bg-amber-50 rounded-2xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-3 text-lg">💡 Chef Tips</Text>
              {generated.tips.map((tip, i) => (
                <Text key={i} className="text-amber-700 mb-2">{tip}</Text>
              ))}
            </View>

            {/* Fun Facts */}
            <View className="bg-purple-50 rounded-2xl p-4 mb-4">
              <Text className="font-bold text-purple-800 mb-2">🎉 Did You Know?</Text>
              {generated.funFacts.filter(f => f.trim()).map((fact, i) => (
                <Text key={i} className="text-purple-700 mb-1">{fact}</Text>
              ))}
            </View>

            {/* Optional Sections */}
            {canCreateShoppingList && (
              <Pressable
                onPress={() => setShowShopping(!showShopping)}
                className="bg-white rounded-xl p-4 mb-3 border-2 border-slate-200"
              >
                <Text className="font-bold text-slate-700">
                  🛒 Shopping List {showShopping ? '▼' : '▶'}
                </Text>
                {showShopping && (
                  <View className="mt-3 pt-3 border-t border-slate-200">
                    {generated.shoppingList.map((item, i) => (
                      <View key={i} className="flex-row items-center mb-2">
                        <View className="w-5 h-5 border-2 border-slate-300 rounded mr-3" />
                        <Text className="text-slate-600">{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Pressable>
            )}

            {canAddNutrition && (
              <Pressable
                onPress={() => setShowNutrition(!showNutrition)}
                className="bg-white rounded-xl p-4 mb-4 border-2 border-slate-200"
              >
                <Text className="font-bold text-slate-700">
                  📊 Nutrition Info {showNutrition ? '▼' : '▶'}
                </Text>
                {showNutrition && (
                  <Text className="text-slate-600 mt-3 font-mono text-sm">
                    {generated.nutritionInfo}
                  </Text>
                )}
              </Pressable>
            )}

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-green-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">💾 Save Recipe</Text>
              </Pressable>
              <Pressable
                onPress={() => setStep('details')}
                className="flex-1 bg-orange-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">✏️ Edit</Text>
              </Pressable>
            </View>

            {onComplete && (
              <Button
                title="Done! 🎉"
                onPress={onComplete}
                size="lg"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
