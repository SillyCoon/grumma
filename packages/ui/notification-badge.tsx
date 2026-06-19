export const NotificationBadge = (props: {
  count?: number;
  size?: "sm" | "md" | "lg";
  placement?: "top-right" | "center-right";
}) => {
  const sizeClasses = {
    sm: "h-2 w-2 text-xs",
    md: "h-4 w-4 text-xs",
    lg: "h-6 w-6 text-sm",
  };

  const placementClasses = {
    "top-right": "-top-1 -right-1",
    "center-right": "top-1/2 -translate-y-1/2 -right-1",
  };

  const sizeClass = sizeClasses[props.size || "md"];
  const placementClass = placementClasses[props.placement || "top-right"];

  return (
    <div
      class={`absolute ${placementClass} flex ${sizeClass} items-center justify-center rounded-full bg-success text-white`}
    >
      {props.count}
    </div>
  );
};
