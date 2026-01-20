import { View, Text } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <View className="mb-6">
      {/* Step text */}
      <Text className="text-white/70 text-sm font-medium mb-3">
        Step {currentStep} of {totalSteps}
      </Text>

      {/* Progress bar */}
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <View
              key={index}
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <View
                className={`h-full rounded-full ${
                  isCompleted || isCurrent ? 'bg-white' : 'bg-transparent'
                }`}
                style={{
                  width: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                }}
              />
            </View>
          );
        })}
      </View>

      {/* Labels */}
      {labels && (
        <View className="flex-row mt-2">
          {labels.map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum <= currentStep;

            return (
              <View key={index} className="flex-1">
                <Text
                  className={`text-xs ${
                    isActive ? 'text-white' : 'text-white/50'
                  }`}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
