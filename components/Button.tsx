import { JSX } from "preact";

const variants = {
  primary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
  ghost:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 px-4 py-2",
  destructive:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2",
  outline:
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",
};

export default function (
  { children, variant, className, onClick, type, id, disabled }: {
    children: JSX.Element | string | Array<JSX.Element | string>;
    variant: keyof typeof variants;
    className?: string;
    onClick?: (_: MouseEvent) => void;
    type?: "button";
    id?: string;
    disabled?: boolean;
  },
) {
  return (
    <button
      id={id}
      type={type}
      className={variants[variant ?? "primary"] + " " + className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
