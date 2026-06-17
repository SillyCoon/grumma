export const NotificationBadge = (props: {
  count?: number;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "h-2 w-2 text-xs",
    md: "h-4 w-4 text-xs",
    lg: "h-6 w-6 text-sm",
  };

  const sizeClass = sizeClasses[props.size || "md"];

  return (
    <div
      class={`absolute -top-1 -right-1 flex ${sizeClass} items-center justify-center rounded-full bg-success text-white`}
    >
      {props.count}
    </div>
  );
};
