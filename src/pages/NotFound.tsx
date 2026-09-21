import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[64vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">Page not found</p>
      <h1 className="mt-3 text-4xl font-semibold">This page is not part of the Academy.</h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        The link may be old, or the learning content may have moved.
      </p>
      <Link to="/" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
        <ArrowLeft className="size-4" />
        Back to courses
      </Link>
    </div>
  );
}
