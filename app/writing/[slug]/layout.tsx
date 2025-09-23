interface LayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function Layout({ children, modal }: LayoutProps) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
