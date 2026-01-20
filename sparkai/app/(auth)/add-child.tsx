import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/lib/stores';
import { AVATAR_OPTIONS } from '@/types';

export default function AddChildScreen() {
  const { parent, addChild } = useAuthStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddChild = async () => {
    if (!name.trim()) {
      Alert.alert('Error', "Please enter your child's name");
      return;
    }

    const ageNum = parseInt(age);
    if (age && (isNaN(ageNum) || ageNum < 5 || ageNum > 18)) {
      Alert.alert('Error', 'Please enter a valid age between 5 and 18');
      return;
    }

    if (!parent) {
      Alert.alert('Error', 'Parent account not found');
      return;
    }

    setIsLoading(true);
    try {
      const child = await addChild({
        parent_id: parent.id,
        display_name: name.trim(),
        avatar_id: selectedAvatar,
        age: ageNum || null,
      });

      if (child) {
        router.replace('/(tabs)/learn');
      } else {
        Alert.alert('Error', 'Failed to add child. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-16 pb-8 px-6">
        <Text className="text-3xl font-bold text-text">Add your learner</Text>
        <Text className="text-text-light mt-2">
          Create a profile for your child to start their AI learning journey
        </Text>
      </View>

      {/* Form */}
      <View className="px-6 space-y-6">
        {/* Avatar selection */}
        <View>
          <Text className="text-text font-medium mb-3">Choose an avatar</Text>
          <View className="flex-row flex-wrap justify-between">
            {AVATAR_OPTIONS.map((avatar) => (
              <Pressable
                key={avatar.id}
                className={`w-[30%] aspect-square bg-surface rounded-2xl items-center justify-center mb-4 border-2 ${
                  selectedAvatar === avatar.id
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <Text className="text-4xl mb-1">{avatar.emoji}</Text>
                <Text className="text-text-light text-xs">{avatar.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Name input */}
        <View>
          <Text className="text-text font-medium mb-2">Child's name</Text>
          <TextInput
            className="bg-surface border border-gray-200 rounded-xl px-4 py-3 text-text"
            placeholder="Enter name"
            placeholderTextColor="#64748B"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* Age input */}
        <View>
          <Text className="text-text font-medium mb-2">Age (optional)</Text>
          <TextInput
            className="bg-surface border border-gray-200 rounded-xl px-4 py-3 text-text"
            placeholder="Enter age"
            placeholderTextColor="#64748B"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text className="text-text-light text-sm mt-1">
            Helps us personalize the learning experience
          </Text>
        </View>

        {/* Submit button */}
        <Pressable
          className={`bg-primary py-4 rounded-2xl items-center mt-4 ${
            isLoading ? 'opacity-50' : 'active:opacity-80'
          }`}
          onPress={handleAddChild}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-lg">
            {isLoading ? 'Creating profile...' : 'Start Learning!'}
          </Text>
        </Pressable>

        {/* Skip for now - only show if they already have children */}
        <View className="items-center pb-8">
          <Text className="text-text-light text-sm text-center">
            You can add more children later from the settings
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
