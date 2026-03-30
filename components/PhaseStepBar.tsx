interface Props {
  currentStep: 0 | 1 | 2 | 3;
  accentColor: string;
  mode?: 'chapter' | 'final-test';
}

const CHAPTER_STEPS = [
  { icon: '📖', label: 'Conceptos' },
  { icon: '✍️', label: 'Explicar' },
  { icon: '🔍', label: 'Revisar' },
  { icon: '✅', label: 'Dominar' },
];

const FINAL_TEST_STEPS = [
  { icon: '✍️', label: 'Escribir' },
  { icon: '🔍', label: 'Revisar' },
  { icon: '🏆', label: 'Completar' },
];

export default function PhaseStepBar({ currentStep, accentColor, mode = 'chapter' }: Props) {
  const steps = mode === 'final-test' ? FINAL_TEST_STEPS : CHAPTER_STEPS;

  return (
    <div className="flex items-center justify-center gap-1 mb-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`flex flex-col items-center transition-all ${
              i < currentStep
                ? 'opacity-60'
                : i === currentStep
                ? 'scale-110'
                : 'opacity-30'
            }`}
          >
            <span className={i === currentStep ? 'text-xl' : 'text-base'}>{step.icon}</span>
            <span
              className="text-xs font-medium"
              style={{ color: i <= currentStep ? accentColor : '#9CA3AF' }}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-6 h-0.5 mx-1 mb-3"
              style={{ backgroundColor: i < currentStep ? accentColor : '#E5E7EB' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
