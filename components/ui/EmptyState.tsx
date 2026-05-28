interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-6xl mb-4 animate-float">{emoji}</div>
      <h3 className="text-lg font-semibold text-brown-600 dark:text-beige-200 mb-2">{title}</h3>
      <p className="text-sm text-brown-400 dark:text-beige-400 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}
