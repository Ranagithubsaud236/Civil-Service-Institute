import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="eyebrow text-brass">404</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Page not found</h1>
        <p className="mt-4 text-ink-soft">The page you are looking for does not exist.</p>
        <Button href="/" className="mt-8">Back to home</Button>
      </div>
    </section>
  );
}
