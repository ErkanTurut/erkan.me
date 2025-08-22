import { BlogPosts } from "app/components/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "./components/ui/separator";
export default function Page() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8 ">
        <h1 className="text-2xl font-semibold tracking-tighter font-mono ">
          erkan turut.
        </h1>
      </div>

      <p className="mb-4 ">
        {`
          I observe, learn, and build systems.
          `}
      </p>
      <Separator />
      <div className="my-8 ">
        <BlogPosts />
      </div>
    </section>
  );
}
