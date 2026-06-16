import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 font-semibold text-primary">
              <BookOpen className="h-5 w-5" />
              bokare.in
            </div>
            <p className="text-sm text-muted-foreground">
              Business Economics study resources for B.Com students. A single platform to help
              economics students be more productive.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-foreground">All Courses</Link></li>
              <li><Link href="/search" className="hover:text-foreground">Search Materials</Link></li>
              <li><Link href="/courses?category=CORE" className="hover:text-foreground">Core Courses</Link></li>
              <li><Link href="/courses?category=ELECTIVE" className="hover:text-foreground">Electives</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              This platform is purely academic and non-commercial. Content is provided by Prof.
              Bokare for B.Com Business Economics students at the undergraduate level.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} bokare.in — Business Economics Learning Resources
        </div>
      </div>
    </footer>
  );
}
