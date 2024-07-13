import { JSX } from "preact";

export default function (
  { children }: { children: JSX.Element | JSX.Element[] },
) {
  return (
    <div
      role="alert"
      class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-circle-alert h-4 w-4"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" x2="12" y1="8" y2="12"></line>
        <line x1="12" x2="12.01" y1="16" y2="16"></line>
      </svg>
      <h5 class="mb-1 font-medium leading-none tracking-tight">Error</h5>
      <div class="text-sm [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
