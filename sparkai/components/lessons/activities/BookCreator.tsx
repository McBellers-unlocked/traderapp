import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';

interface BookPage {
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
}

interface BookCreatorProps {
  title: string;
  minPages: number;
  maxPages: number;
  includesCover?: boolean;
  includesAuthorPage?: boolean;
  canDownloadPDF?: boolean;
  canPrint?: boolean;
  onComplete?: () => void;
  onSave?: (book: any) => void;
}

export function BookCreator({
  title,
  minPages,
  maxPages,
  includesCover = true,
  includesAuthorPage = true,
  canDownloadPDF = true,
  canPrint = true,
  onComplete,
  onSave,
}: BookCreatorProps) {
  const [step, setStep] = useState<'setup' | 'writing' | 'illustrating' | 'preview'>('setup');
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookGenre, setBookGenre] = useState('');
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const genres = [
    { id: 'adventure', label: 'Adventure', emoji: '🗺️' },
    { id: 'fantasy', label: 'Fantasy', emoji: '🧙' },
    { id: 'funny', label: 'Funny', emoji: '😂' },
    { id: 'mystery', label: 'Mystery', emoji: '🔍' },
    { id: 'animals', label: 'Animals', emoji: '🐾' },
    { id: 'space', label: 'Space', emoji: '🚀' },
  ];

  const startWriting = () => {
    setPages(Array.from({ length: minPages }, () => ({ text: '', imagePrompt: '' })));
    setStep('writing');
  };

  const updatePage = (index: number, field: 'text' | 'imagePrompt', value: string) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], [field]: value };
    setPages(newPages);
  };

  const addPage = () => {
    if (pages.length < maxPages) {
      setPages([...pages, { text: '', imagePrompt: '' }]);
    }
  };

  const removePage = (index: number) => {
    if (pages.length > minPages) {
      const newPages = pages.filter((_, i) => i !== index);
      setPages(newPages);
      if (currentPage >= newPages.length) {
        setCurrentPage(newPages.length - 1);
      }
    }
  };

  const generateIllustrations = async () => {
    setStep('illustrating');
    setIsGenerating(true);

    try {
      // Generate cover
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCoverImage(`https://picsum.photos/seed/cover-${bookTitle}/400/600`);

      // Generate page illustrations
      const illustratedPages: BookPage[] = [];
      for (let i = 0; i < pages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        illustratedPages.push({
          ...pages[i],
          imageUrl: `https://picsum.photos/seed/page-${i}-${pages[i].text.slice(0, 10)}/400/300`,
        });
      }
      setPages(illustratedPages);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedToIllustrate = () => {
    return pages.length >= minPages && pages.every(p => p.text.trim().length > 20);
  };

  const handleSave = () => {
    onSave?.({
      title: bookTitle,
      author: authorName,
      genre: bookGenre,
      cover: coverImage,
      pages,
    });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        {/* Header */}
        <View className="items-center mb-4">
          <Text className="text-3xl mb-2">📕</Text>
          <Text className="text-xl font-bold text-slate-800">{title}</Text>
        </View>

        {/* Step 1: Setup */}
        {step === 'setup' && (
          <View>
            <Text className="text-slate-600 text-center mb-6">
              Create your very own illustrated storybook!
            </Text>

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-2">Book Title:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50"
                placeholder="The Amazing Adventure"
                value={bookTitle}
                onChangeText={setBookTitle}
              />
            </View>

            {includesAuthorPage && (
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                <Text className="font-semibold text-slate-700 mb-2">Author Name (You!):</Text>
                <TextInput
                  className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50"
                  placeholder="Your name here"
                  value={authorName}
                  onChangeText={setAuthorName}
                />
              </View>
            )}

            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="font-semibold text-slate-700 mb-3">Pick a Genre:</Text>
              <View className="flex-row flex-wrap gap-2">
                {genres.map((genre) => (
                  <Pressable
                    key={genre.id}
                    onPress={() => setBookGenre(genre.id)}
                    className={`flex-row items-center px-4 py-2 rounded-full border-2 ${
                      bookGenre === genre.id
                        ? 'bg-indigo-100 border-indigo-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text className="mr-1">{genre.emoji}</Text>
                    <Text className={`font-medium ${
                      bookGenre === genre.id ? 'text-indigo-700' : 'text-slate-600'
                    }`}>
                      {genre.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="bg-amber-50 rounded-xl p-4 mb-4">
              <Text className="text-amber-800">
                📖 Your book will have {minPages}-{maxPages} pages with illustrations on each page!
              </Text>
            </View>

            <Button
              title="Start Writing! ✍️"
              onPress={startWriting}
              disabled={!bookTitle.trim() || !bookGenre || (includesAuthorPage && !authorName.trim())}
              size="lg"
            />
          </View>
        )}

        {/* Step 2: Writing */}
        {step === 'writing' && (
          <View>
            {/* Progress */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-600">
                Page {currentPage + 1} of {pages.length}
              </Text>
              <View className="flex-row gap-1">
                {pages.map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setCurrentPage(index)}
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      pages[index].text.trim()
                        ? 'bg-green-500'
                        : index === currentPage
                        ? 'bg-indigo-500'
                        : 'bg-slate-200'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${
                      pages[index].text.trim() || index === currentPage
                        ? 'text-white'
                        : 'text-slate-500'
                    }`}>
                      {index + 1}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Page Editor */}
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 border-4 border-amber-200">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-slate-800">Page {currentPage + 1}</Text>
                {pages.length > minPages && (
                  <Pressable
                    onPress={() => removePage(currentPage)}
                    className="bg-red-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-red-600 text-sm">Remove</Text>
                  </Pressable>
                )}
              </View>

              <Text className="font-medium text-slate-700 mb-2">Your story:</Text>
              <TextInput
                className="border-2 border-indigo-200 rounded-xl p-3 bg-indigo-50 min-h-[120px]"
                placeholder="Once upon a time..."
                value={pages[currentPage]?.text || ''}
                onChangeText={(val) => updatePage(currentPage, 'text', val)}
                multiline
                textAlignVertical="top"
              />

              <Text className="font-medium text-slate-700 mb-2 mt-4">
                Describe the picture for this page:
              </Text>
              <TextInput
                className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50"
                placeholder="A brave knight standing in front of a castle..."
                value={pages[currentPage]?.imagePrompt || ''}
                onChangeText={(val) => updatePage(currentPage, 'imagePrompt', val)}
              />
            </View>

            {/* Navigation */}
            <View className="flex-row gap-3 mb-4">
              {currentPage > 0 && (
                <Pressable
                  onPress={() => setCurrentPage(currentPage - 1)}
                  className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                >
                  <Text className="text-slate-700 font-medium">← Previous</Text>
                </Pressable>
              )}

              {currentPage < pages.length - 1 ? (
                <Pressable
                  onPress={() => setCurrentPage(currentPage + 1)}
                  className="flex-1 bg-indigo-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Next →</Text>
                </Pressable>
              ) : (
                pages.length < maxPages && (
                  <Pressable
                    onPress={addPage}
                    className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                  >
                    <Text className="text-white font-bold">+ Add Page</Text>
                  </Pressable>
                )
              )}
            </View>

            {/* Generate Button */}
            <Button
              title={canProceedToIllustrate() ? "Create Illustrations! 🎨" : `Write at least ${minPages} pages`}
              onPress={generateIllustrations}
              disabled={!canProceedToIllustrate()}
              size="lg"
            />

            <Pressable onPress={() => setStep('setup')} className="mt-3 py-2">
              <Text className="text-slate-500 text-center">← Back to Setup</Text>
            </Pressable>
          </View>
        )}

        {/* Step 3: Illustrating */}
        {step === 'illustrating' && (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="text-xl font-bold text-indigo-600 mt-6">
              Creating your illustrations...
            </Text>
            <Text className="text-slate-500 mt-2">
              Drawing beautiful pictures for your book!
            </Text>
          </View>
        )}

        {/* Step 4: Preview */}
        {step === 'preview' && (
          <View>
            {/* Book Cover */}
            {includesCover && coverImage && (
              <View className="items-center mb-6">
                <View className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-1 shadow-xl">
                  <View className="bg-white rounded-xl overflow-hidden">
                    <Image
                      source={{ uri: coverImage }}
                      className="w-48 h-64"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 items-center justify-center bg-black/30">
                      <Text className="text-white text-xl font-bold text-center px-4">
                        {bookTitle}
                      </Text>
                      {authorName && (
                        <Text className="text-white/80 mt-2">by {authorName}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <Text className="text-slate-500 mt-2">Your Book Cover!</Text>
              </View>
            )}

            {/* Page Thumbnails */}
            <Text className="font-bold text-slate-800 mb-3">Your Pages ({pages.length}):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-3">
                {pages.map((page, index) => (
                  <View key={index} className="w-36">
                    <View className="bg-white rounded-xl overflow-hidden shadow-md border-2 border-slate-200">
                      {page.imageUrl && (
                        <Image
                          source={{ uri: page.imageUrl }}
                          className="w-36 h-24"
                          resizeMode="cover"
                        />
                      )}
                      <View className="p-2">
                        <Text className="text-slate-600 text-xs" numberOfLines={3}>
                          {page.text}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-center text-slate-400 text-xs mt-1">
                      Page {index + 1}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Actions */}
            <View className="bg-green-50 rounded-xl p-4 mb-4 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-green-800 font-bold text-lg">Your book is ready!</Text>
              <Text className="text-green-600 text-center mt-1">
                {pages.length} pages of pure awesomeness!
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              {canDownloadPDF && (
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-green-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">📥 Download PDF</Text>
                </Pressable>
              )}
              {canPrint && (
                <Pressable className="flex-1 bg-blue-500 py-3 rounded-xl items-center">
                  <Text className="text-white font-bold">🖨️ Print</Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => setStep('writing')}
              className="py-3"
            >
              <Text className="text-indigo-600 text-center font-medium">
                ✏️ Edit My Book
              </Text>
            </Pressable>

            {onComplete && (
              <Button
                title="All Done! 🎉"
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
