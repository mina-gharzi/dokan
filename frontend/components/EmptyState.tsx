export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-700 font-medium">{title}</p>
      {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
    </div>
  );
}