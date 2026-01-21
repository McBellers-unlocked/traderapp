import { View, Text, Pressable, Dimensions, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sparky image
const SparkyImage = require('@/assets/images/sparky.png');

const onboardingSlides = [
  {
    title: 'Future-Proof Your Child',
    subtitle: 'AI skills they\'ll use forever',
    description: 'Kids who understand AI today will lead tomorrow. Give them a head start with fun, age-appropriate lessons.',
    mascotExpression: 'waving' as const,
    backgroundColor: ['#6366F1', '#8B5CF6'] as const,
  },
  {
    title: 'Learn by Doing',
    subtitle: 'Not just watching',
    description: 'Interactive projects, games, and quizzes make complex concepts stick. No boring lectures here!',
    mascotExpression: 'excited' as const,
    backgroundColor: ['#8B5CF6', '#A855F7'] as const,
  },
  {
    title: 'Track Their Progress',
    subtitle: 'Celebrate every win',
    description: 'Earn badges, build streaks, and watch your child grow confident in technology skills.',
    mascotExpression: 'happy' as const,
    backgroundColor: ['#A855F7', '#D946EF'] as const,
  },
];

export default function WelcomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % onboardingSlides.length;
      setActiveSlide(nextSlide);
      scrollRef.current?.scrollTo({ x: nextSlide * SCREEN_WIDTH, animated: true });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeSlide]);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveSlide(slideIndex);
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {onboardingSlides.map((slide, index) => (
          <View key={index} style={{ width: SCREEN_WIDTH }} className="flex-1">
            <LinearGradient
              colors={[...slide.backgroundColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-1 pt-12 pb-6 px-6"
            >
              {/* Decorative circles */}
              <View className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10" />
              <View className="absolute top-32 left-5 w-16 h-16 rounded-full bg-white/10" />
              <View className="absolute bottom-20 right-20 w-20 h-20 rounded-full bg-white/10" />

              {/* Content */}
              <View className="flex-1 items-center justify-center px-4">
                <Image
                  source={SparkyImage}
                  style={{ width: 180, height: 180 }}
                  resizeMode="contain"
                />

                <View className="mt-6">
                  <Text className="text-3xl font-bold text-white text-center mb-2">
                    {slide.title}
                  </Text>
                  <Text className="text-white/70 text-center text-base mb-3 font-medium">
                    {slide.subtitle}
                  </Text>
                  <Text className="text-white/90 text-center text-base leading-relaxed px-2">
                    {slide.description}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View className="flex-row justify-center py-4 bg-slate-50">
        {onboardingSlides.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setActiveSlide(index);
              scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
            }}
          >
            <View
              className={`mx-1.5 rounded-full transition-all ${
                activeSlide === index
                  ? 'bg-indigo-500 w-8 h-2'
                  : 'bg-slate-300 w-2 h-2'
              }`}
            />
          </Pressable>
        ))}
      </View>

      {/* Feature cards */}
      <View className="px-6 pb-4">
        <View className="flex-row justify-between">
          <FeatureCard
            icon={<GameIcon />}
            title="5 Modules"
            subtitle="15+ lessons"
            color="#6366F1"
          />
          <FeatureCard
            icon={<TrophyIcon />}
            title="Badges"
            subtitle="50+ to earn"
            color="#F59E0B"
          />
          <FeatureCard
            icon={<StarIcon />}
            title="Projects"
            subtitle="Build real AI"
            color="#10B981"
          />
        </View>
      </View>

      {/* Parent value prop */}
      <View className="px-6 pb-3">
        <View className="bg-emerald-50 rounded-2xl p-4 flex-row items-center">
          <View className="bg-emerald-100 rounded-full p-2 mr-3">
            <ShieldIcon />
          </View>
          <View className="flex-1">
            <Text className="text-emerald-800 font-semibold text-sm">
              Screen time you can feel good about
            </Text>
            <Text className="text-emerald-600 text-xs mt-0.5">
              Educational content designed by experts
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom buttons */}
      <View className="px-6 pb-10">
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Button title="Get Started Free" onPress={() => {}} size="lg" />
          </Pressable>
        </Link>

        <View className="mt-5 flex-row justify-center items-center">
          <Text className="text-slate-500">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-indigo-600 font-bold underline">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <View
      className="bg-white rounded-2xl p-4 items-center flex-1 mx-1"
      style={{
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-2"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </View>
      <Text className="text-slate-800 font-bold text-sm">{title}</Text>
      <Text className="text-slate-500 text-xs">{subtitle}</Text>
    </View>
  );
}

function GameIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
        fill="#6366F1"
      />
    </Svg>
  );
}

function TrophyIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
        fill="#F59E0B"
      />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="#10B981"
      />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#059669"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke="#059669"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
