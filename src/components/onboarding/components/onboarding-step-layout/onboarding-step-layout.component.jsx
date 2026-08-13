"use client";

export default function OnboardingStepLayout({
  as: Tag = "div",
  onSubmit,
  footer,
  fillHeight = false,
  children,
}) {
  return (
    <Tag
      {...(Tag === "form" ? { onSubmit } : {})}
      className="flex h-full min-h-0 flex-1 flex-col"
    >
      <div
        className={`min-h-0 flex-1 overflow-y-auto px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 ${
          fillHeight ? "flex flex-col" : ""
        }`}
      >
        <div
          className={
            fillHeight ? "flex min-h-full flex-1 flex-col" : "flex w-full flex-col gap-3"
          }
        >
          {children}
        </div>
      </div>
      {footer ? (
        <div className="sticky bottom-0 z-[1] mt-auto flex shrink-0 flex-col-reverse gap-2 border-t bg-indigo-100 p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-4">
          {footer}
        </div>
      ) : null}
    </Tag>
  );
}
