import Modal from "./modal";

interface PageProps {
  params: Promise<{ img_slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { img_slug } = await params;
  const src = `/img/${img_slug}`;
  return <Modal src={src} alt={img_slug} />;
}
