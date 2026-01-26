import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface PartyPlannerProps {
  title: string;
  partyTypes: string[];
  canGenerateInvite?: boolean;
  canCreateSchedule?: boolean;
  canSuggestGames?: boolean;
  onComplete?: () => void;
  onSave?: (party: any) => void;
}

interface PartyData {
  type: string;
  theme: string;
  guestOfHonor: string;
  date: string;
  time: string;
  location: string;
  guestCount: string;
  activities: string[];
  food: string[];
  specialRequests: string;
}

interface GeneratedPlan {
  invitation: string;
  schedule: { time: string; activity: string; emoji: string }[];
  gameIdeas: { name: string; description: string; emoji: string }[];
  decorIdeas: string[];
  partyFavor: string;
}

export function PartyPlanner({
  title,
  partyTypes,
  canGenerateInvite = true,
  canCreateSchedule = true,
  canSuggestGames = true,
  onComplete,
  onSave,
}: PartyPlannerProps) {
  const [step, setStep] = useState<'type' | 'details' | 'preferences' | 'generating' | 'plan'>('type');
  const [party, setParty] = useState<PartyData>({
    type: '',
    theme: '',
    guestOfHonor: '',
    date: '',
    time: '',
    location: '',
    guestCount: '',
    activities: [],
    food: [],
    specialRequests: '',
  });
  const [generated, setGenerated] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<'invite' | 'schedule' | 'games'>('invite');

  const partyInfo: Record<string, { emoji: string; themes: string[]; color: string }> = {
    'birthday': {
      emoji: '🎂',
      themes: ['Superhero', 'Princess', 'Dinosaur', 'Space', 'Unicorn', 'Sports', 'Gaming'],
      color: '#EC4899',
    },
    'sleepover': {
      emoji: '🛏️',
      themes: ['Movie Night', 'Spa Night', 'Gaming Marathon', 'Outdoor Camping', 'Dance Party'],
      color: '#8B5CF6',
    },
    'pool party': {
      emoji: '🏊',
      themes: ['Tropical', 'Mermaid', 'Beach', 'Water Olympics', 'Luau'],
      color: '#06B6D4',
    },
    'holiday': {
      emoji: '🎄',
      themes: ['Christmas', 'Halloween', 'Easter', 'New Year', 'Thanksgiving'],
      color: '#22C55E',
    },
    'game day': {
      emoji: '🎮',
      themes: ['Video Games', 'Board Games', 'Sports Watch Party', 'Outdoor Games'],
      color: '#F59E0B',
    },
  };

  const foodOptions = [
    { id: 'pizza', label: 'Pizza', emoji: '🍕' },
    { id: 'cake', label: 'Cake', emoji: '🎂' },
    { id: 'snacks', label: 'Snacks', emoji: '🍿' },
    { id: 'ice cream', label: 'Ice Cream', emoji: '🍦' },
    { id: 'sandwiches', label: 'Sandwiches', emoji: '🥪' },
    { id: 'fruit', label: 'Fruit', emoji: '🍓' },
    { id: 'drinks', label: 'Drinks', emoji: '🧃' },
    { id: 'cupcakes', label: 'Cupcakes', emoji: '🧁' },
  ];

  const updateParty = (field: keyof PartyData, value: any) => {
    setParty({ ...party, [field]: value });
  };

  const toggleFood = (food: string) => {
    const current = party.food;
    if (current.includes(food)) {
      updateParty('food', current.filter(f => f !== food));
    } else {
      updateParty('food', [...current, food]);
    }
  };

  const generatePlan = async () => {
    setStep('generating');
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const info = partyInfo[party.type];

      const invitation = `
✨ You're Invited! ✨

${info.emoji} ${party.theme} ${party.type.charAt(0).toUpperCase() + party.type.slice(1)} Party! ${info.emoji}

Join us to celebrate ${party.guestOfHonor || 'an amazing day'}!

📅 Date: ${party.date || 'Coming Soon'}
🕐 Time: ${party.time || 'TBD'}
📍 Where: ${party.location || 'Somewhere Awesome'}

${party.food.length > 0 ? `🍽️ Food: ${party.food.join(', ')}` : ''}

RSVP to let us know you're coming!

Can't wait to see you there! 🎉
      `.trim();

      const schedule = [
        { time: party.time || '2:00 PM', activity: 'Guests Arrive! Welcome everyone!', emoji: '👋' },
        { time: addMinutes(party.time || '2:00 PM', 15), activity: 'Free play & warm-up activities', emoji: '🎈' },
        { time: addMinutes(party.time || '2:00 PM', 30), activity: 'Main Game/Activity #1', emoji: '🎮' },
        { time: addMinutes(party.time || '2:00 PM', 60), activity: 'Snack break!', emoji: '🍕' },
        { time: addMinutes(party.time || '2:00 PM', 75), activity: 'Main Game/Activity #2', emoji: '🎯' },
        { time: addMinutes(party.time || '2:00 PM', 105), activity: party.type === 'birthday' ? 'Cake & singing!' : 'More fun activities!', emoji: party.type === 'birthday' ? '🎂' : '🎉' },
        { time: addMinutes(party.time || '2:00 PM', 120), activity: 'Party favors & goodbyes', emoji: '🎁' },
      ];

      const gameIdeas = getGameIdeas(party.type, party.theme);

      const decorIdeas = [
        `${info.emoji} ${party.theme}-themed balloons`,
        `🎊 Matching tablecloth and plates`,
        `✨ ${party.theme} banner or backdrop`,
        `🖼️ Photo booth props`,
        `🎵 ${party.theme} playlist`,
      ];

      const partyFavor = `🎁 Goodie bags with: ${party.theme}-themed stickers, candy, small toys, and a "Thank You" note!`;

      setGenerated({
        invitation,
        schedule,
        gameIdeas,
        decorIdeas,
        partyFavor,
      });

      setStep('plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const addMinutes = (time: string, minutes: number): string => {
    const [timePart, period] = time.split(' ');
    const [hours, mins] = timePart.split(':').map(Number);
    let totalMins = (hours % 12) * 60 + mins + minutes;
    if (period === 'PM' && hours !== 12) totalMins += 12 * 60;

    const newHours = Math.floor(totalMins / 60) % 24;
    const newMins = totalMins % 60;
    const newPeriod = newHours >= 12 ? 'PM' : 'AM';
    const displayHours = newHours % 12 || 12;

    return `${displayHours}:${newMins.toString().padStart(2, '0')} ${newPeriod}`;
  };

  const getGameIdeas = (type: string, theme: string): { name: string; description: string; emoji: string }[] => {
    const games: Record<string, { name: string; description: string; emoji: string }[]> = {
      'birthday': [
        { name: 'Musical Chairs', description: 'Dance around chairs, sit when music stops!', emoji: '🪑' },
        { name: 'Pin the Tail', description: `Blindfolded fun with a ${theme} twist!`, emoji: '🎯' },
        { name: 'Treasure Hunt', description: 'Find hidden prizes around the party area!', emoji: '🗺️' },
        { name: 'Freeze Dance', description: 'Dance until the music stops, then freeze!', emoji: '💃' },
      ],
      'sleepover': [
        { name: 'Pillow Fight Tournament', description: 'Safe, soft battle royale!', emoji: '🛏️' },
        { name: 'Movie Marathon', description: 'Vote on favorite movies to watch!', emoji: '🎬' },
        { name: 'Truth or Dare', description: 'Fun questions and silly challenges!', emoji: '🎲' },
        { name: 'Makeover Station', description: 'Try fun hairstyles and face masks!', emoji: '💅' },
      ],
      'pool party': [
        { name: 'Marco Polo', description: 'Classic pool hide and seek!', emoji: '🏊' },
        { name: 'Diving Contest', description: 'Best splash or fanciest dive wins!', emoji: '🤿' },
        { name: 'Pool Noodle Jousting', description: 'Balance and knock others off floats!', emoji: '⚔️' },
        { name: 'Water Balloon Toss', description: 'Catch without popping!', emoji: '🎈' },
      ],
      'holiday': [
        { name: 'Holiday Trivia', description: 'Test knowledge about the holiday!', emoji: '❓' },
        { name: 'Decoration Contest', description: 'Best decorated cookie/ornament wins!', emoji: '🎨' },
        { name: 'Scavenger Hunt', description: 'Find holiday-themed items!', emoji: '🔍' },
        { name: 'Gift Wrap Race', description: 'Fastest wrapper wins!', emoji: '🎁' },
      ],
      'game day': [
        { name: 'Tournament Mode', description: 'Bracket-style competition in chosen game!', emoji: '🏆' },
        { name: 'Team Challenges', description: 'Split into teams for epic battles!', emoji: '👥' },
        { name: 'Speed Runs', description: 'Who can complete challenges fastest?', emoji: '⚡' },
        { name: 'Mystery Game', description: 'Random game selection wheel!', emoji: '🎰' },
      ],
    };

    return games[type] || games['birthday'];
  };

  const canProceed = () => {
    if (step === 'details') {
      return party.theme && party.location.trim();
    }
    if (step === 'preferences') {
      return party.food.length > 0;
    }
    return true;
  };

  const handleSave = () => {
    onSave?.({
      ...party,
      generated,
    });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">🎉</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Progress */}
        {!['plan', 'generating'].includes(step) && (
          <View className="flex-row justify-center gap-2 mb-4">
            {['type', 'details', 'preferences'].map((s, index) => (
              <View
                key={s}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  step === s
                    ? 'bg-pink-500'
                    : ['type', 'details', 'preferences'].indexOf(step) > index
                    ? 'bg-green-500'
                    : 'bg-slate-200'
                }`}
              >
                <Text className={`text-xs font-bold ${
                  ['type', 'details', 'preferences'].indexOf(step) >= index ? 'text-white' : 'text-slate-500'
                }`}>
                  {['type', 'details', 'preferences'].indexOf(step) > index ? '✓' : index + 1}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Step 1: Party Type */}
        {step === 'type' && (
          <View>
            <Text className="text-slate-600 text-center mb-4">
              What kind of party are you planning?
            </Text>

            <View className="gap-3">
              {partyTypes.map((type) => {
                const info = partyInfo[type];
                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      updateParty('type', type);
                      setStep('details');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-200 flex-row items-center"
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: info?.color + '20' }}
                    >
                      <Text className="text-2xl">{info?.emoji || '🎉'}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-slate-800 capitalize text-lg">{type}</Text>
                      <Text className="text-slate-500 text-sm">
                        {info?.themes.slice(0, 3).join(', ')}...
                      </Text>
                    </View>
                    <Text style={{ color: info?.color }}>→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <View>
            <View
              className="rounded-2xl p-4 mb-4"
              style={{ backgroundColor: partyInfo[party.type]?.color }}
            >
              <Text className="text-3xl text-center mb-1">
                {partyInfo[party.type]?.emoji}
              </Text>
              <Text className="text-white text-xl font-bold text-center capitalize">
                {party.type} Party
              </Text>
            </View>

            {/* Theme Selection */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Choose a Theme:</Text>
              <View className="flex-row flex-wrap gap-2">
                {partyInfo[party.type]?.themes.map((theme) => (
                  <Pressable
                    key={theme}
                    onPress={() => updateParty('theme', theme)}
                    className={`px-4 py-2 rounded-full border-2 ${
                      party.theme === theme
                        ? 'bg-pink-50'
                        : 'border-slate-200'
                    }`}
                    style={{
                      borderColor: party.theme === theme ? partyInfo[party.type]?.color : undefined,
                    }}
                  >
                    <Text className={party.theme === theme ? 'text-pink-700 font-medium' : 'text-slate-600'}>
                      {theme}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Guest of Honor */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                {party.type === 'birthday' ? "Who's the birthday star?" : 'Guest of Honor (optional):'}
              </Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="Name"
                value={party.guestOfHonor}
                onChangeText={(val) => updateParty('guestOfHonor', val)}
              />
            </View>

            {/* Date & Time */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                <Text className="font-semibold text-slate-700 mb-2">📅 Date:</Text>
                <TextInput
                  className="border-2 border-slate-200 rounded-lg p-2 bg-slate-50"
                  placeholder="Saturday, Dec 15"
                  value={party.date}
                  onChangeText={(val) => updateParty('date', val)}
                />
              </View>
              <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                <Text className="font-semibold text-slate-700 mb-2">🕐 Time:</Text>
                <TextInput
                  className="border-2 border-slate-200 rounded-lg p-2 bg-slate-50"
                  placeholder="2:00 PM"
                  value={party.time}
                  onChangeText={(val) => updateParty('time', val)}
                />
              </View>
            </View>

            {/* Location */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">📍 Location:</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="My backyard, the park, etc."
                value={party.location}
                onChangeText={(val) => updateParty('location', val)}
              />
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
                  title="Next: Food & Fun →"
                  onPress={() => setStep('preferences')}
                  disabled={!canProceed()}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Preferences */}
        {step === 'preferences' && (
          <View>
            <View className="bg-amber-500 rounded-2xl p-4 mb-4">
              <Text className="text-white text-xl font-bold text-center">
                🍕 Food & Fun
              </Text>
              <Text className="text-amber-100 text-center mt-1">
                What will you serve?
              </Text>
            </View>

            {/* Food Selection */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Select food items:</Text>
              <View className="flex-row flex-wrap gap-2">
                {foodOptions.map((food) => (
                  <Pressable
                    key={food.id}
                    onPress={() => toggleFood(food.id)}
                    className={`flex-row items-center px-4 py-2 rounded-full border-2 ${
                      party.food.includes(food.id)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <Text className="mr-2">{food.emoji}</Text>
                    <Text className={party.food.includes(food.id) ? 'text-amber-700' : 'text-slate-600'}>
                      {food.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Guest Count */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">👥 How many guests?</Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="10"
                value={party.guestCount}
                onChangeText={(val) => updateParty('guestCount', val)}
                keyboardType="number-pad"
              />
            </View>

            {/* Special Requests */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">
                ✨ Any special requests? (optional)
              </Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[80px]"
                placeholder="Allergies, accessibility needs, must-have activities..."
                value={party.specialRequests}
                onChangeText={(val) => updateParty('specialRequests', val)}
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
                  title="Create Party Plan! 🎉"
                  onPress={generatePlan}
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
            <ActivityIndicator size="large" color="#EC4899" />
            <Text className="text-xl font-bold text-pink-600 mt-6">
              Planning your party...
            </Text>
            <Text className="text-slate-500 mt-2">Creating invites, schedule & games!</Text>
          </View>
        )}

        {/* Party Plan */}
        {step === 'plan' && generated && (
          <View>
            {/* Header Card */}
            <View
              className="rounded-2xl p-4 mb-4"
              style={{ backgroundColor: partyInfo[party.type]?.color }}
            >
              <Text className="text-4xl text-center mb-2">
                {partyInfo[party.type]?.emoji}
              </Text>
              <Text className="text-white text-2xl font-bold text-center">
                {party.theme} {party.type.charAt(0).toUpperCase() + party.type.slice(1)}!
              </Text>
              {party.guestOfHonor && (
                <Text className="text-white/80 text-center mt-1">
                  Celebrating {party.guestOfHonor}
                </Text>
              )}
            </View>

            {/* Tab Navigation */}
            <View className="flex-row bg-slate-200 rounded-xl p-1 mb-4">
              {[
                { id: 'invite' as const, label: '✉️ Invite', enabled: canGenerateInvite },
                { id: 'schedule' as const, label: '📋 Schedule', enabled: canCreateSchedule },
                { id: 'games' as const, label: '🎮 Games', enabled: canSuggestGames },
              ].filter(t => t.enabled).map((tab) => (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveSection(tab.id)}
                  className={`flex-1 py-2 rounded-lg ${activeSection === tab.id ? 'bg-white' : ''}`}
                >
                  <Text className={`text-center font-medium ${
                    activeSection === tab.id ? 'text-pink-600' : 'text-slate-500'
                  }`}>
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Invitation */}
            {activeSection === 'invite' && canGenerateInvite && (
              <View className="bg-white rounded-2xl p-4 shadow-sm border-2 border-pink-200 mb-4">
                <Text className="text-slate-700 whitespace-pre-wrap font-medium">
                  {generated.invitation}
                </Text>
              </View>
            )}

            {/* Schedule */}
            {activeSection === 'schedule' && canCreateSchedule && (
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                <Text className="font-bold text-slate-800 mb-3 text-lg">📋 Party Schedule</Text>
                {generated.schedule.map((item, i) => (
                  <View key={i} className="flex-row items-center mb-3 pb-3 border-b border-slate-100 last:border-0">
                    <View className="w-16">
                      <Text className="text-slate-500 text-sm">{item.time}</Text>
                    </View>
                    <Text className="text-xl mr-3">{item.emoji}</Text>
                    <Text className="flex-1 text-slate-700">{item.activity}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Games */}
            {activeSection === 'games' && canSuggestGames && (
              <View className="gap-3 mb-4">
                {generated.gameIdeas.map((game, i) => (
                  <View key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-2xl mr-3">{game.emoji}</Text>
                      <Text className="font-bold text-slate-800 text-lg">{game.name}</Text>
                    </View>
                    <Text className="text-slate-600">{game.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Decoration Ideas */}
            <View className="bg-purple-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-purple-800 mb-2">🎨 Decoration Ideas:</Text>
              {generated.decorIdeas.map((idea, i) => (
                <Text key={i} className="text-purple-700 mb-1">• {idea}</Text>
              ))}
            </View>

            {/* Party Favor */}
            <View className="bg-green-50 rounded-xl p-4 mb-4">
              <Text className="font-bold text-green-800 mb-1">Party Favors:</Text>
              <Text className="text-green-700">{generated.partyFavor}</Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleSave}
                className="flex-1 bg-green-500 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-bold">💾 Save Plan</Text>
              </Pressable>
              <Pressable
                onPress={() => setStep('details')}
                className="flex-1 bg-pink-500 py-3 rounded-xl items-center"
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
