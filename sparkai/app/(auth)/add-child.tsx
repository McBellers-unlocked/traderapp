import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/lib/stores';
import { supabase } from '@/lib/supabase';
import { AVATAR_OPTIONS } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AvatarIcon, getAvatarType } from '@/components/ui/AvatarIcon';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { trackAddChild } from '@/lib/tracking';
import Svg, { Path, Circle } from 'react-native-svg';

const SparkyImage = require('@/assets/images/sparky.png');

export default function AddChildScreen() {
  const { parent, addChild, setParent } = useAuthStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingParent, setIsFetchingParent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [showAgeInfo, setShowAgeInfo] = useState(false);

  // Fetch parent data if not available (fallback)
  useEffect(() => {
    const fetchParentIfNeeded = async () => {
      if (parent) {
        setIsFetchingParent(false);
        return;
      }

      setIsFetchingParent(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use maybeSingle to avoid error when no row exists
          const { data: parentData } = await supabase
            .from('parents')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (parentData) {
            setParent(parentData);
          } else {
            // Create parent record if it doesn't exist
            console.log('Creating parent record for user:', user.id);
            const { data: newParent, error } = await supabase
              .from('parents')
              .insert({ user_id: user.id, email: user.email })
              .select()
              .single();

            if (newParent) {
              setParent(newParent);
            } else if (error) {
              console.error('Failed to create parent:', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch parent:', error);
      } finally {
        setIsFetchingParent(false);
      }
    };

    fetchParentIfNeeded();
  }, [parent, setParent]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your child's name";
    }

    if (age) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 18) {
        newErrors.age = 'Age should be between 5 and 18';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddChild = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Get current parent or try to fetch/create one
      let currentParent = parent;

      if (!currentParent) {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Try to fetch existing parent
          const { data: existingParent } = await supabase
            .from('parents')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (existingParent) {
            currentParent = existingParent;
            setParent(existingParent);
          } else {
            // Create parent record if it doesn't exist
            const { data: newParent } = await supabase
              .from('parents')
              .insert({ user_id: user.id, email: user.email })
              .select()
              .single();

            if (newParent) {
              currentParent = newParent;
              setParent(newParent);
            }
          }
        }
      }

      // Try to add child to database
      if (currentParent) {
        const ageNum = age ? parseInt(age) : null;
        await addChild({
          parent_id: currentParent.id,
          display_name: name.trim(),
          avatar_id: selectedAvatar,
          age: ageNum,
        });
      } else {
        // Demo mode: set a mock active child in the store for UI preview
        const { setActiveChild, setChildren } = useAuthStore.getState();
        const mockChild = {
          id: 'demo-child',
          parent_id: 'demo-parent',
          display_name: name.trim(),
          avatar_id: selectedAvatar,
          age: age ? parseInt(age) : null,
          created_at: new Date().toISOString(),
        };
        setChildren([mockChild]);
        setActiveChild(mockChild);
      }

      // Track child profile added
      trackAddChild();

      // Navigate to learn tab
      router.replace('/(tabs)/learn');
    } catch (err) {
      console.error('Add child error:', err);
      // Still navigate even if there's an error - demo mode
      const { setActiveChild, setChildren } = useAuthStore.getState();
      const mockChild = {
        id: 'demo-child',
        parent_id: 'demo-parent',
        display_name: name.trim(),
        avatar_id: selectedAvatar,
        age: age ? parseInt(age) : null,
        created_at: new Date().toISOString(),
      };
      setChildren([mockChild]);
      setActiveChild(mockChild);
      router.replace('/(tabs)/learn');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while fetching parent data
  if (isFetchingParent) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-slate-500 mt-4">Setting up your account...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-8 px-6 rounded-b-3xl"
      >
        {/* Step indicator */}
        <StepIndicator currentStep={2} totalSteps={2} />

        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">
              Add your learner
            </Text>
            <Text className="text-white/80 text-base">
              Almost done! Create a profile for your child
            </Text>
          </View>
          <View className="ml-4">
            <Image
              source={SparkyImage}
              style={{ width: 70, height: 70 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>

      {/* Form */}
      <View className="px-6 pt-8">
        {/* Avatar selection */}
        <View className="mb-6">
          <Text className="text-slate-700 font-semibold mb-4 text-base">
            Choose an avatar
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {AVATAR_OPTIONS.map((avatar) => (
              <Pressable
                key={avatar.id}
                className="w-[31%] mb-4 items-center"
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <View
                  className={`p-2 rounded-2xl ${
                    selectedAvatar === avatar.id
                      ? 'bg-indigo-100'
                      : 'bg-white'
                  }`}
                  style={{
                    shadowColor: selectedAvatar === avatar.id ? '#6366F1' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: selectedAvatar === avatar.id ? 0.2 : 0.08,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <AvatarIcon
                    type={getAvatarType(avatar.id)}
                    size={64}
                    selected={selectedAvatar === avatar.id}
                  />
                </View>
                <Text
                  className={`mt-2 text-sm font-medium ${
                    selectedAvatar === avatar.id
                      ? 'text-indigo-600'
                      : 'text-slate-500'
                  }`}
                >
                  {avatar.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Name input */}
        <Input
          label="Child's name"
          placeholder="Enter name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          autoCapitalize="words"
          error={errors.name}
          icon={<UserIcon />}
        />

        {/* Age input with "Why we ask" */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-700 font-semibold text-sm">
              Age (optional)
            </Text>
            <Pressable
              onPress={() => setShowAgeInfo(!showAgeInfo)}
              className="flex-row items-center"
            >
              <InfoIcon />
              <Text className="text-indigo-600 text-xs ml-1 font-medium">
                Why we ask
              </Text>
            </Pressable>
          </View>

          {/* Info tooltip */}
          {showAgeInfo && (
            <View className="bg-indigo-50 rounded-xl p-3 mb-3 border border-indigo-100">
              <Text className="text-indigo-700 text-sm leading-relaxed">
                We use age to adjust lesson difficulty and vocabulary to match your child's level. Your data is never shared.
              </Text>
            </View>
          )}

          <Input
            placeholder="Enter age"
            value={age}
            onChangeText={(text) => {
              setAge(text);
              if (errors.age) setErrors({ ...errors, age: undefined });
            }}
            keyboardType="number-pad"
            error={errors.age}
            icon={<CakeIcon />}
          />
        </View>

        {/* Submit button */}
        <Button
          title="Start Learning!"
          onPress={handleAddChild}
          loading={isLoading}
          size="lg"
        />

        {/* Helper text */}
        <View className="items-center mt-6 pb-8">
          <Text className="text-slate-400 text-sm text-center">
            You can add more children later from settings
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function UserIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CakeIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8M4 16h16M12 7V4M8 7V5M16 7V5M9 11h.01M15 11h.01"
        stroke="#94A3B8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InfoIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke="#6366F1" strokeWidth={2} />
      <Path
        d="M12 16v-4M12 8h.01"
        stroke="#6366F1"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
