interface Props {
  currentStep: 0 | 1 | 2 | 3;
  accentColor: string;
}

const STEPS = [
  { icon: '📖', label: 'Conceptos' },
  { icon: '✍️', label: 'Explicar' },
  { icon: '🔍', label: 'Revisar' },
  { icon: '✅', label: 'Dominar' },
];

export default function PhaseStepBar({ currentStep, accentColor }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 mb-4">
      {STEPS.map((step, i) => (
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
          {i < STEPS.length - 1 && (
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
