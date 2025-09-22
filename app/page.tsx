import { BlogPosts } from "app/components/posts";
import { Separator } from "./components/ui/separator";
import { CustomMDX } from "./components/mdx";
import fs from "fs";
import path from "path";
export default function Page() {
  const aboutPath = path.join(process.cwd(), "app", "_content", "about.mdx");
  const about = fs.readFileSync(aboutPath, "utf-8");
  return (
    <section>
      <div className="flex justify-between items-center mb-8 ">
        <h1 className="text-2xl font-semibold tracking-tighter font-mono ">
          erkan turut
        </h1>
      </div>

      <article className="prose mb-4">
        <CustomMDX source={about} />
      </article>
      {/* <Separator />
      <div className="my-8 ">
        <h2 className="text-xl font-semibold mb-2 ">Writing</h2>
        <BlogPosts />
      </div> */}
    </section>
  );
}
