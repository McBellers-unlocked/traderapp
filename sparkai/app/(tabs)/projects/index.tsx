import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useAuthStore, useProgressStore } from '@/lib/stores';

export default function ProjectsScreen() {
  const { activeChild } = useAuthStore();
  const { projects, fetchProjects } = useProgressStore();

  useEffect(() => {
    if (activeChild) {
      fetchProjects(activeChild.id);
    }
  }, [activeChild, fetchProjects]);

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-surface border-b border-gray-100">
        <Text className="text-2xl font-bold text-text">My Projects</Text>
        <Text className="text-text-light mt-1">
          Your creative AI projects live here
        </Text>
      </View>

      {/* Projects grid */}
      <View className="p-6">
        {projects.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">🎨</Text>
            <Text className="text-xl font-bold text-text mb-2">
              No projects yet
            </Text>
            <Text className="text-text-light text-center">
              Complete project lessons to create{'\n'}amazing AI projects!
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {projects.map((project) => (
              <Pressable
                key={project.id}
                className="w-[48%] bg-surface rounded-2xl p-4 mb-4 border border-gray-100 active:opacity-90"
              >
                <View className="aspect-square bg-gray-100 rounded-xl items-center justify-center mb-3">
                  <Text className="text-4xl">
                    {project.project_type === 'scavenger_hunt'
                      ? '📸'
                      : project.project_type === 'art_studio'
                      ? '🎨'
                      : project.project_type === 'image_classifier'
                      ? '🤖'
                      : '📝'}
                  </Text>
                </View>
                <Text className="text-text font-semibold" numberOfLines={1}>
                  {project.title || 'Untitled Project'}
                </Text>
                <Text className="text-text-light text-sm capitalize">
                  {project.project_type.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
