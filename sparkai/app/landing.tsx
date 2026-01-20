import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Svg, { Path, Circle } from 'react-native-svg';

// Import the actual brand images
const SparkyImage = require('@/assets/images/SparkAI icon only.png');
const LogoFullImage = require('@/assets/images/SparkAI.png');
const WordmarkImage = require('@/assets/images/Spark AI Wordmark only.png');

export default function LandingPage() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hero Section */}
      <LinearGradient
        colors={['#7C3AED', '#8B5CF6', '#A78BFA']}
        className="pt-16 pb-20 px-6"
      >
        {/* Nav */}
        <View className="flex-row items-center justify-between mb-12">
          <Image
            source={LogoFullImage}
            style={{ width: 150, height: 50 }}
            resizeMode="contain"
          />
          <Pressable onPress={() => router.push('/login')}>
            <Text className="text-white/90 font-medium">Sign In</Text>
          </Pressable>
        </View>

        {/* Hero Content */}
        <View className="items-center">
          <View className="mb-6">
            <Image
              source={SparkyImage}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>

          <Text className="text-white text-4xl font-bold text-center mb-4">
            Teach Your Kids{'\n'}About AI
          </Text>

          <Text className="text-white/80 text-lg text-center mb-8 max-w-md">
            Fun, interactive lessons that prepare children ages 8-12 for an AI-powered future. No coding required.
          </Text>

          <View className="flex-row gap-4">
            <Pressable
              onPress={() => router.push('/signup')}
              className="bg-white px-8 py-4 rounded-2xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <Text className="text-indigo-600 font-bold text-lg">Start Free</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/welcome')}
              className="border-2 border-white/50 px-8 py-4 rounded-2xl"
            >
              <Text className="text-white font-bold text-lg">See Demo</Text>
            </Pressable>
          </View>
        </View>

        {/* Trust badges */}
        <View className="flex-row justify-center gap-8 mt-12">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">5</Text>
            <Text className="text-white/70 text-sm">Modules</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">15+</Text>
            <Text className="text-white/70 text-sm">Lessons</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">50+</Text>
            <Text className="text-white/70 text-sm">Activities</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Problem Section */}
      <View className="py-16 px-6 bg-slate-50">
        <View className="max-w-2xl mx-auto">
          <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
            AI is Everywhere.{'\n'}Are Your Kids Ready?
          </Text>
          <Text className="text-slate-600 text-center text-lg mb-8">
            From ChatGPT to self-driving cars, AI is reshaping our world. Children who understand AI today will thrive tomorrow.
          </Text>

          <View className="gap-4">
            <ProblemCard
              emoji="🤔"
              title="Kids are curious about AI"
              description="But most resources are too technical or not age-appropriate"
            />
            <ProblemCard
              emoji="😰"
              title="Parents feel unprepared"
              description="How do you explain machine learning to an 8-year-old?"
            />
            <ProblemCard
              emoji="📱"
              title="Screen time guilt is real"
              description="Not all apps are created equal—most are just entertainment"
            />
          </View>
        </View>
      </View>

      {/* Solution Section */}
      <View className="py-16 px-6">
        <View className="max-w-2xl mx-auto">
          <View className="items-center mb-8">
            <View className="bg-green-100 px-4 py-2 rounded-full mb-4">
              <Text className="text-green-700 font-semibold">The Solution</Text>
            </View>
            <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
              Screen Time You Can{'\n'}Feel Good About
            </Text>
          </View>

          <View className="gap-6">
            <FeatureCard
              icon="🎮"
              title="Gamified Learning"
              description="Quizzes, sorting games, and interactive activities keep kids engaged while they learn real AI concepts."
            />
            <FeatureCard
              icon="🤖"
              title="Meet Sparky"
              description="Our friendly AI mascot guides kids through each lesson with encouragement and fun explanations."
            />
            <FeatureCard
              icon="👨‍👩‍👧"
              title="Parent-Approved"
              description="Designed by educators. No ads, no inappropriate content. Progress tracking for parents."
            />
            <FeatureCard
              icon="🏆"
              title="Earn Rewards"
              description="Badges, XP points, and certificates keep motivation high. Kids love showing off achievements!"
            />
          </View>
        </View>
      </View>

      {/* Curriculum Preview */}
      <View className="py-16 px-6 bg-indigo-50">
        <View className="max-w-2xl mx-auto">
          <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
            What Kids Will Learn
          </Text>
          <Text className="text-slate-600 text-center mb-8">
            5 modules covering essential AI literacy
          </Text>

          <View className="gap-4">
            <ModuleCard
              number={1}
              title="AI Fundamentals"
              description="What is AI? How does it learn?"
              color="#6366F1"
              free
            />
            <ModuleCard
              number={2}
              title="AI in Daily Life"
              description="Spotting AI in apps, games, and home"
              color="#8B5CF6"
            />
            <ModuleCard
              number={3}
              title="How AI Thinks"
              description="Patterns, data, and predictions"
              color="#A855F7"
            />
            <ModuleCard
              number={4}
              title="AI & Creativity"
              description="Art, music, and stories with AI"
              color="#EC4899"
            />
            <ModuleCard
              number={5}
              title="AI Ethics & Safety"
              description="Using AI responsibly"
              color="#F59E0B"
            />
          </View>
        </View>
      </View>

      {/* Social Proof */}
      <View className="py-16 px-6">
        <View className="max-w-2xl mx-auto">
          <Text className="text-3xl font-bold text-slate-800 text-center mb-8">
            Parents & Kids Love SparkAI
          </Text>

          <View className="gap-4">
            <TestimonialCard
              quote="Finally, an app that makes me feel good about screen time. My daughter actually asks to learn!"
              author="Sarah M."
              role="Mom of 2"
              stars={5}
            />
            <TestimonialCard
              quote="I learned what AI is and now I can explain it to my friends. Sparky is so cool!"
              author="Jake, age 10"
              role="SparkAI Explorer"
              stars={5}
            />
            <TestimonialCard
              quote="As a teacher, I recommend this to all my students' parents. Engaging and educational."
              author="Mr. Thompson"
              role="5th Grade Teacher"
              stars={5}
            />
          </View>
        </View>
      </View>

      {/* Pricing */}
      <View className="py-16 px-6 bg-slate-50">
        <View className="max-w-2xl mx-auto">
          <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
            Simple Pricing
          </Text>
          <Text className="text-slate-600 text-center mb-8">
            Start free, upgrade when you're ready
          </Text>

          <View className="flex-row gap-4 flex-wrap justify-center">
            <PricingCard
              title="Free"
              price="$0"
              period="forever"
              features={[
                'Module 1 (3 lessons)',
                '1 child profile',
                'Basic progress tracking',
                'Meet Sparky!',
              ]}
              buttonText="Start Free"
              onPress={() => router.push('/signup')}
              highlighted={false}
            />
            <PricingCard
              title="Premium"
              price="$49"
              period="/year"
              features={[
                'All 5 modules (15+ lessons)',
                'Up to 4 child profiles',
                'Detailed parent dashboard',
                'Badges & certificates',
                'Offline mode',
                'New content monthly',
              ]}
              buttonText="Get Premium"
              onPress={() => router.push('/signup')}
              highlighted
            />
          </View>
        </View>
      </View>

      {/* Final CTA */}
      <LinearGradient
        colors={['#7C3AED', '#8B5CF6']}
        className="py-16 px-6"
      >
        <View className="max-w-2xl mx-auto items-center">
          <Image
            source={SparkyImage}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
          <Text className="text-white text-3xl font-bold text-center mt-6 mb-4">
            Ready to Start?
          </Text>
          <Text className="text-white/80 text-center text-lg mb-8">
            Join thousands of families preparing their kids for the future.
          </Text>
          <Pressable
            onPress={() => router.push('/signup')}
            className="bg-white px-12 py-4 rounded-2xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text className="text-indigo-600 font-bold text-xl">Start Learning Free</Text>
          </Pressable>
          <Text className="text-white/60 text-sm mt-4">
            No credit card required
          </Text>
        </View>
      </LinearGradient>

      {/* FAQ Section */}
      <View className="py-16 px-6 bg-white">
        <View className="max-w-2xl mx-auto">
          <Text className="text-3xl font-bold text-slate-800 text-center mb-8">
            Common Questions
          </Text>

          <View className="gap-4">
            <FAQItem
              question="What age is SparkAI for?"
              answer="SparkAI is designed for children ages 8-12, but curious kids as young as 6 or teens up to 14 can enjoy it too!"
            />
            <FAQItem
              question="Do kids need to know how to code?"
              answer="Not at all! SparkAI teaches AI concepts through stories, games, and activities—no coding required."
            />
            <FAQItem
              question="How long are the lessons?"
              answer="Each lesson takes about 5-10 minutes, perfect for short attention spans and busy schedules."
            />
            <FAQItem
              question="Can I try before I pay?"
              answer="Yes! Module 1 (3 full lessons) is completely free. No credit card required to start."
            />
            <FAQItem
              question="Is my child's data safe?"
              answer="Absolutely. We collect minimal data, never show ads, and comply with COPPA regulations for children's privacy."
            />
          </View>
        </View>
      </View>

      {/* Urgency Banner */}
      <View className="bg-amber-400 py-4 px-6">
        <View className="max-w-2xl mx-auto flex-row items-center justify-center">
          <Text className="text-slate-900 font-bold text-center">
            🚀 Launch Special: Get 40% off annual plans this month!
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="py-8 px-6 bg-slate-900">
        <View className="max-w-2xl mx-auto">
          <View className="flex-row items-center justify-center mb-4">
            <Image
              source={WordmarkImage}
              style={{ width: 120, height: 40 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-slate-400 text-center text-sm mb-4">
            AI education for the next generation
          </Text>
          <View className="flex-row justify-center gap-6">
            <Pressable>
              <Text className="text-slate-400 text-sm">Privacy Policy</Text>
            </Pressable>
            <Pressable>
              <Text className="text-slate-400 text-sm">Terms of Service</Text>
            </Pressable>
            <Pressable>
              <Text className="text-slate-400 text-sm">Contact</Text>
            </Pressable>
          </View>
          <Text className="text-slate-500 text-center text-xs mt-6">
            © 2025 SparkAI. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Component: Problem Card
function ProblemCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <View className="bg-white rounded-2xl p-5 flex-row items-start" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }}>
      <Text className="text-3xl mr-4">{emoji}</Text>
      <View className="flex-1">
        <Text className="font-bold text-slate-800 text-lg">{title}</Text>
        <Text className="text-slate-600 mt-1">{description}</Text>
      </View>
    </View>
  );
}

// Component: Feature Card
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View className="bg-white rounded-2xl p-6 border border-slate-100" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }}>
      <View className="flex-row items-start">
        <View className="bg-indigo-100 w-12 h-12 rounded-xl items-center justify-center mr-4">
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-slate-800 text-lg mb-1">{title}</Text>
          <Text className="text-slate-600">{description}</Text>
        </View>
      </View>
    </View>
  );
}

// Component: Module Card
function ModuleCard({
  number,
  title,
  description,
  color,
  free = false
}: {
  number: number;
  title: string;
  description: string;
  color: string;
  free?: boolean;
}) {
  return (
    <View className="bg-white rounded-2xl p-4 flex-row items-center" style={{
      borderLeftWidth: 4,
      borderLeftColor: color,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }}>
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${color}20` }}
      >
        <Text className="font-bold" style={{ color }}>{number}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="font-bold text-slate-800">{title}</Text>
          {free && (
            <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
              <Text className="text-green-700 text-xs font-semibold">FREE</Text>
            </View>
          )}
        </View>
        <Text className="text-slate-500 text-sm">{description}</Text>
      </View>
    </View>
  );
}

// Component: Testimonial Card
function TestimonialCard({
  quote,
  author,
  role,
  stars
}: {
  quote: string;
  author: string;
  role: string;
  stars: number;
}) {
  return (
    <View className="bg-white rounded-2xl p-6 border border-slate-100" style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }}>
      <View className="flex-row mb-3">
        {[...Array(stars)].map((_, i) => (
          <Text key={i} className="text-amber-400">⭐</Text>
        ))}
      </View>
      <Text className="text-slate-700 text-base italic mb-4">"{quote}"</Text>
      <View>
        <Text className="font-bold text-slate-800">{author}</Text>
        <Text className="text-slate-500 text-sm">{role}</Text>
      </View>
    </View>
  );
}

// Component: Pricing Card
function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  onPress,
  highlighted
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  onPress: () => void;
  highlighted: boolean;
}) {
  return (
    <View
      className={`rounded-2xl p-6 min-w-[280px] ${highlighted ? 'bg-indigo-600' : 'bg-white border border-slate-200'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: highlighted ? 0.2 : 0.05,
        shadowRadius: 12,
      }}
    >
      {highlighted && (
        <View className="bg-amber-400 px-3 py-1 rounded-full self-start mb-4">
          <Text className="text-slate-900 text-xs font-bold">MOST POPULAR</Text>
        </View>
      )}
      <Text className={`text-lg font-semibold ${highlighted ? 'text-white' : 'text-slate-800'}`}>
        {title}
      </Text>
      <View className="flex-row items-end mt-2 mb-4">
        <Text className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-slate-800'}`}>
          {price}
        </Text>
        <Text className={`text-lg ml-1 ${highlighted ? 'text-white/70' : 'text-slate-500'}`}>
          {period}
        </Text>
      </View>
      <View className="gap-3 mb-6">
        {features.map((feature, i) => (
          <View key={i} className="flex-row items-center">
            <Text className={`mr-2 ${highlighted ? 'text-green-300' : 'text-green-500'}`}>✓</Text>
            <Text className={highlighted ? 'text-white' : 'text-slate-600'}>{feature}</Text>
          </View>
        ))}
      </View>
      <Pressable
        onPress={onPress}
        className={`py-3 rounded-xl items-center ${highlighted ? 'bg-white' : 'bg-indigo-600'}`}
      >
        <Text className={`font-bold ${highlighted ? 'text-indigo-600' : 'text-white'}`}>
          {buttonText}
        </Text>
      </Pressable>
    </View>
  );
}

// Component: FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <View className="bg-slate-50 rounded-2xl p-5">
      <Text className="font-bold text-slate-800 text-lg mb-2">{question}</Text>
      <Text className="text-slate-600">{answer}</Text>
    </View>
  );
}
