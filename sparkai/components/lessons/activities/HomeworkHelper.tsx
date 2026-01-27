import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface HomeworkHelperProps {
  title: string;
  subjects: string[];
  canExplainStepByStep?: boolean;
  canGeneratePractice?: boolean;
  canCheckWork?: boolean;
  onComplete?: () => void;
}

interface HelpSession {
  subject: string;
  topic: string;
  question: string;
  helpType: 'explain' | 'practice' | 'check';
  response: string | null;
}

export function HomeworkHelper({
  title,
  subjects,
  canExplainStepByStep = true,
  canGeneratePractice = true,
  canCheckWork = true,
  onComplete,
}: HomeworkHelperProps) {
  const [step, setStep] = useState<'subject' | 'topic' | 'question' | 'helping' | 'result'>('subject');
  const [session, setSession] = useState<HelpSession>({
    subject: '',
    topic: '',
    question: '',
    helpType: 'explain',
    response: null,
  });
  const [isHelping, setIsHelping] = useState(false);
  const [helpHistory, setHelpHistory] = useState<HelpSession[]>([]);

  const subjectInfo: Record<string, { emoji: string; topics: string[]; color: string }> = {
    'math': {
      emoji: '🔢',
      topics: ['Addition & Subtraction', 'Multiplication & Division', 'Fractions', 'Word Problems', 'Geometry'],
      color: '#3B82F6',
    },
    'science': {
      emoji: '🔬',
      topics: ['Plants & Animals', 'Weather', 'Space', 'Human Body', 'Energy'],
      color: '#10B981',
    },
    'english': {
      emoji: '📚',
      topics: ['Reading Comprehension', 'Grammar', 'Writing', 'Vocabulary', 'Spelling'],
      color: '#8B5CF6',
    },
    'history': {
      emoji: '🏛️',
      topics: ['Ancient Civilizations', 'Famous People', 'Important Events', 'Geography', 'Culture'],
      color: '#F59E0B',
    },
    'coding': {
      emoji: '💻',
      topics: ['Variables', 'Loops', 'Functions', 'Conditionals', 'Debugging'],
      color: '#EC4899',
    },
  };

  const helpTypes = [
    {
      id: 'explain' as const,
      emoji: '📖',
      title: 'Explain Step-by-Step',
      desc: 'Break it down so I understand',
      enabled: canExplainStepByStep,
    },
    {
      id: 'practice' as const,
      emoji: '✏️',
      title: 'Give Me Practice',
      desc: 'More problems like this',
      enabled: canGeneratePractice,
    },
    {
      id: 'check' as const,
      emoji: '✅',
      title: 'Check My Work',
      desc: "See if I'm on the right track",
      enabled: canCheckWork,
    },
  ];

  const updateSession = (field: keyof HelpSession, value: string) => {
    setSession({ ...session, [field]: value });
  };

  const generateHelp = async () => {
    setStep('helping');
    setIsHelping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      let response = '';
      const info = subjectInfo[session.subject];

      if (session.helpType === 'explain') {
        if (session.subject === 'math') {
          response = `Great question about ${session.topic}! Let me break this down:

📌 **Understanding the Problem:**
${session.question}

📝 **Step 1: Identify what we know**
Look at the numbers and words in the problem. What information are we given?

📝 **Step 2: Decide what to do**
Based on the key words:
- "total" or "altogether" → add
- "difference" or "left" → subtract
- "groups of" or "each" → multiply
- "share" or "split" → divide

📝 **Step 3: Solve it**
Write out the math problem and solve step by step.

📝 **Step 4: Check your answer**
Does it make sense? Try plugging it back in!

💡 **Tip:** Always show your work so you can find any mistakes!`;
        } else if (session.subject === 'science') {
          response = `Let's explore ${session.topic}! 🔬

📌 **Your Question:**
${session.question}

🧪 **Here's what we know:**

Science is all about observing and asking questions - just like you're doing!

**Key Concept:**
Everything in ${session.topic.toLowerCase()} follows certain patterns and rules that scientists have discovered through experiments.

**Think About It:**
- What can you observe?
- What stays the same?
- What changes?

**Fun Fact:**
Scientists often don't get things right the first time - they learn from mistakes too!

💡 **Try This:** Draw a picture or diagram of what you're learning about. It helps your brain remember!`;
        } else {
          response = `Let's work through ${session.topic} together! ${info.emoji}

📌 **Your Question:**
${session.question}

📝 **Here's how to think about it:**

1. First, read carefully and identify what you need to find
2. Look for important details and key words
3. Think about what you already know about this topic
4. Put the pieces together

💡 **Remember:** It's okay to re-read things multiple times. Even experts do that!

**Need More Help?**
Try asking: "Can you show me an example?" or "What's another way to think about this?"`;
        }
      } else if (session.helpType === 'practice') {
        if (session.subject === 'math') {
          response = `Here are some practice problems for ${session.topic}! 📝

**Warm-Up (Easy):**
1. 12 + 8 = ?
2. 25 - 7 = ?
3. 6 × 4 = ?

**Level Up (Medium):**
4. 156 + 89 = ?
5. 203 - 67 = ?
6. 8 × 12 = ?

**Challenge (Hard):**
7. 1,234 + 567 = ?
8. 500 - 238 = ?
9. 15 × 15 = ?

**Word Problem:**
10. Maya has 24 stickers. She gives an equal number to 4 friends. How many stickers does each friend get?

💪 **You've got this!** Take your time and show your work.`;
        } else {
          response = `Practice time for ${session.topic}! ${info.emoji}

**Quick Quiz:**

1. True or False: _______________
   (Think about what you learned!)

2. Fill in the blank: _______________
   (Use the vocabulary!)

3. Short Answer: Why is ${session.topic.toLowerCase()} important?
   (Write 2-3 sentences)

**Creative Challenge:**
Draw or write about something related to ${session.topic} that interests you!

**Discussion:**
Explain ${session.topic.toLowerCase()} to someone in your family. Teaching helps you learn!

💡 **Tip:** If you get stuck, that's normal! Go back and review, then try again.`;
        }
      } else {
        response = `Let's check your work! ✅

📌 **About your question:**
${session.question}

**Checking Process:**

✅ **First, let's verify your approach:**
- Did you identify what the problem is asking?
- Did you use the right method?
- Did you show your steps?

✅ **Common things to double-check:**
- Did you copy all numbers correctly?
- Did you include units (if needed)?
- Does your answer make sense?

✅ **Self-Check Questions:**
- Is your answer reasonable?
- Can you explain WHY your answer is correct?
- Would you get the same answer if you solved it a different way?

💡 **Great job asking to check your work!** That's what good learners do.

📝 **Share your answer with me** and I can tell you if you're on the right track!`;
      }

      setSession({ ...session, response });
      setStep('result');
    } finally {
      setIsHelping(false);
    }
  };

  const startNewQuestion = () => {
    if (session.response) {
      setHelpHistory([...helpHistory, session]);
    }
    setSession({
      subject: session.subject,
      topic: session.topic,
      question: '',
      helpType: 'explain',
      response: null,
    });
    setStep('question');
  };

  const startOver = () => {
    if (session.response) {
      setHelpHistory([...helpHistory, session]);
    }
    setSession({
      subject: '',
      topic: '',
      question: '',
      helpType: 'explain',
      response: null,
    });
    setStep('subject');
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">📚</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
          <Text className="text-slate-500 text-center mt-1">
            AI helps you learn - it won't do your homework for you!
          </Text>
        </View>

        {/* Help History Badge */}
        {helpHistory.length > 0 && (
          <View className="bg-green-100 rounded-xl px-4 py-2 mb-4 flex-row items-center justify-center">
            <Text className="text-green-700">
              🌟 {helpHistory.length} question{helpHistory.length > 1 ? 's' : ''} explored today!
            </Text>
          </View>
        )}

        {/* Step 1: Subject */}
        {step === 'subject' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What subject do you need help with?
            </Text>

            <View className="gap-3">
              {subjects.map((subject) => {
                const info = subjectInfo[subject];
                return (
                  <Pressable
                    key={subject}
                    onPress={() => {
                      updateSession('subject', subject);
                      setStep('topic');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: info?.color + '20' }}
                    >
                      <Text className="text-2xl">{info?.emoji || '📖'}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800 capitalize text-lg">{subject}</Text>
                      <Text className="text-slate-500 text-sm">
                        {info?.topics.length} topics available
                      </Text>
                    </View>
                    <Text className="text-indigo-500">→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Topic */}
        {step === 'topic' && (
          <View>
            <View
              className="rounded-2xl p-4 mb-4"
              style={{ backgroundColor: subjectInfo[session.subject]?.color + '20' }}
            >
              <Text className="text-2xl text-center mb-1">
                {subjectInfo[session.subject]?.emoji}
              </Text>
              <Text className="text-lg font-bold text-slate-800 text-center capitalize">
                {session.subject}
              </Text>
            </View>

            <Text className="text-slate-600 text-center mb-4">
              What topic are you working on?
            </Text>

            <View className="gap-2">
              {subjectInfo[session.subject]?.topics.map((topic) => (
                <Pressable
                  key={topic}
                  onPress={() => {
                    updateSession('topic', topic);
                    setStep('question');
                  }}
                  className="bg-white rounded-xl p-4 shadow-sm border-2 border-slate-200"
                >
                  <Text className="font-medium text-slate-700">{topic}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => setStep('subject')}
              className="mt-4 py-2"
            >
              <Text className="text-indigo-600 text-center">← Different Subject</Text>
            </Pressable>
          </View>
        )}

        {/* Step 3: Question */}
        {step === 'question' && (
          <View>
            <View
              className="rounded-2xl p-4 mb-4"
              style={{ backgroundColor: subjectInfo[session.subject]?.color + '20' }}
            >
              <Text className="font-bold text-slate-800 text-center capitalize">
                {subjectInfo[session.subject]?.emoji} {session.subject}: {session.topic}
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                What do you need help with?
              </Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-4 bg-indigo-50 min-h-[120px]"
                placeholder="Type your question or paste the problem here..."
                value={session.question}
                onChangeText={(val) => updateSession('question', val)}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Help Type Selection */}
            <Text className="font-semibold text-slate-700 mb-2 px-1">
              How should I help?
            </Text>
            <View className="gap-2 mb-4">
              {helpTypes.filter(t => t.enabled).map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => updateSession('helpType', type.id)}
                  className={`bg-white rounded-xl p-4 border-2 ${
                    session.helpType === type.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">{type.emoji}</Text>
                    <View className="flex-1">
                      <Text className={`font-medium ${
                        session.helpType === type.id ? 'text-indigo-700' : 'text-slate-700'
                      }`}>
                        {type.title}
                      </Text>
                      <Text className="text-slate-500 text-sm">{type.desc}</Text>
                    </View>
                    {session.helpType === type.id && (
                      <Text className="text-indigo-500">✓</Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep('topic')}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-medium">← Back</Text>
              </Pressable>
              <View className="flex-1">
                <Button
                  title="Get Help! 🚀"
                  onPress={generateHelp}
                  disabled={!session.question.trim()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Helping State */}
        {step === 'helping' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Thinking about your question...
            </Text>
            <Text className="text-slate-500 mt-2">
              {session.helpType === 'explain' && 'Breaking it down step by step!'}
              {session.helpType === 'practice' && 'Creating practice problems!'}
              {session.helpType === 'check' && 'Reviewing your work!'}
            </Text>
          </View>
        )}

        {/* Result */}
        {step === 'result' && (
          <View>
            {/* Topic Header */}
            <View
              className="rounded-2xl p-4 mb-4"
              style={{ backgroundColor: subjectInfo[session.subject]?.color }}
            >
              <Text className="text-white text-center font-bold">
                {subjectInfo[session.subject]?.emoji} {session.topic}
              </Text>
            </View>

            {/* Your Question */}
            <View className="bg-slate-100 rounded-xl p-4 mb-4">
              <Text className="font-semibold text-slate-700 mb-1">Your Question:</Text>
              <Text className="text-slate-600">{session.question}</Text>
            </View>

            {/* AI Response */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 border-2 border-indigo-100">
              <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-2">🤖</Text>
                <Text className="font-bold text-indigo-700">AI Helper Says:</Text>
              </View>
              <Text className="text-slate-700 leading-6">{session.response}</Text>
            </View>

            {/* Learning Reminder */}
            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-amber-800 mb-1">🧠 Remember:</Text>
              <Text className="text-amber-700 text-sm">
                AI is here to help you LEARN, not do your work. Try to solve problems
                yourself first, then ask for help understanding!
              </Text>
            </View>

            {/* Actions */}
            <View className="gap-3">
              <Button
                title="Ask Another Question 💬"
                onPress={startNewQuestion}
                size="lg"
              />

              <Pressable
                onPress={startOver}
                className="py-3"
              >
                <Text className="text-indigo-600 text-center font-medium">
                  📚 Different Subject
                </Text>
              </Pressable>
            </View>

            {onComplete && (
              <Button
                title="Done! 🎉"
                onPress={onComplete}
                size="lg"
                className="mt-4"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
