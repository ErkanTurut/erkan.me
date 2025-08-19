import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        erkan turut
      </h1>
      <p className="mb-4">
        {`
        hi, I'm erkan. I just like building systems.
        `}
      </p>
      <div className="my-8 ">
        <BlogPosts />
      </div>
    </section>
  );
}
