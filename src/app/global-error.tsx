"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div>
          <h2>Something went wrong!</h2>
          <p>A critical error occurred.</p>
        </div>
      </body>
    </html>
  )
}
