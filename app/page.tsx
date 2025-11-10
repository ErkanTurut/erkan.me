import { CustomMDX } from "./components/mdx";
import { PatrickBatemanCard } from "./components/patrick-bateman-card";
import fs from "fs";
import path from "path";
export default function Page() {
  const aboutPath = path.join(process.cwd(), "app", "_content", "about.mdx");
  const about = fs.readFileSync(aboutPath, "utf-8");
  return (
    <section>
      <div className="flex justify-between items-center mb-8 ">
        <h1 className="text-2xl font-semibold">Erkan turut</h1>
      </div>

      <article className="prose mb-4">
        <CustomMDX source={about} />
      </article>

      <PatrickBatemanCard />
    </section>
  );
}
