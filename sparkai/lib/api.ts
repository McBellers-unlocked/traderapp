import { supabase } from './supabase';

/**
 * API helper for making requests to Supabase Edge Functions
 * This includes the AI chat functionality that proxies Claude API
 */

interface AIResponse {
  response: string;
  error?: string;
}

/**
 * Get a kid-friendly AI response using Claude via Supabase Edge Function
 * The Edge Function handles API key security and content filtering
 */
export async function getAIResponse(
  prompt: string,
  childAge: number = 10
): Promise<AIResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        prompt,
        systemPrompt: `You are a friendly AI assistant helping a ${childAge}-year-old child learn about artificial intelligence.

Key guidelines:
- Keep responses simple, encouraging, and age-appropriate
- Never use scary language about AI
- Limit responses to 2-3 sentences
- Use analogies kids understand (games, school, sports)
- Be enthusiastic and supportive
- If asked about something inappropriate, redirect to the learning topic`,
      },
    });

    if (error) {
      console.error('AI chat error:', error);
      return { response: '', error: error.message };
    }

    return { response: data.response };
  } catch (err) {
    console.error('AI chat failed:', err);
    return { response: '', error: 'Failed to get AI response' };
  }
}

/**
 * Generate a fun AI fact for the home screen
 */
export async function getAIFact(): Promise<string> {
  const facts = [
    'Did you know? The first AI program was written in 1951!',
    "AI can recognize your face faster than you can say 'cheese'! 📸",
    'Some AI can compose music that sounds like it was written by humans! 🎵',
    'AI helps doctors find diseases in X-rays that humans might miss! 🏥',
    'Self-driving cars use AI to see the road and make decisions! 🚗',
    'AI can translate between over 100 languages instantly! 🌍',
    'Video game characters use AI to decide how to play against you! 🎮',
    'AI helps scientists discover new medicines to help people! 💊',
    'Some AI can paint pictures just from a description you give it! 🎨',
    'AI assistants like Siri learn from millions of conversations! 📱',
  ];

  // Return a random fact (in production, could fetch from API)
  return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Submit feedback for a lesson (used by parents)
 */
export async function submitLessonFeedback(
  lessonId: string,
  childId: string,
  rating: number,
  comment?: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('lesson_feedback').insert({
      lesson_id: lessonId,
      child_id: childId,
      rating,
      comment,
    });

    return !error;
  } catch (err) {
    console.error('Failed to submit feedback:', err);
    return false;
  }
}

/**
 * Get conversation starters for parents based on completed lessons
 */
export function getConversationStarters(completedLessonIds: string[]): string[] {
  const starters: Record<string, string[]> = {
    'lesson-1-1': [
      'Ask your child: Can you name 3 things in our house that use AI?',
      'Discuss: What would you ask an AI assistant to help you with?',
    ],
    'lesson-1-2': [
      'Ask: What do you think AI is better at than humans?',
      'Discuss: What are some things that only humans can do?',
    ],
    'lesson-2-1': [
      'Ask: How does AI learn from examples?',
      'Activity: Draw pictures together and talk about patterns',
    ],
    'lesson-3-1': [
      'Practice: Give each other instructions and see how specific they need to be',
      'Ask: Why do clear instructions help AI understand better?',
    ],
    'lesson-4-1': [
      'Discuss: Can you think of a time AI might make a mistake?',
      'Ask: Why is it important to check if AI is right?',
    ],
    'lesson-5-1': [
      'Ask: When would be a good time to use AI for help?',
      'Discuss: Why should we still think for ourselves even when using AI?',
    ],
  };

  const relevantStarters: string[] = [];
  completedLessonIds.forEach((lessonId) => {
    if (starters[lessonId]) {
      relevantStarters.push(...starters[lessonId]);
    }
  });

  // Return up to 3 recent conversation starters
  return relevantStarters.slice(-3);
}
