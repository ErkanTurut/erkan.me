import { ExternalLinkIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="mt-auto pb-1">
      <ul className="font-mono text-sm gap-4 flex flex-row text-muted-foreground ">
        <li>
          <a
            className="flex items-center hover:text-foreground transition-colors"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <p>rss</p>
            <ExternalLinkIcon className="ml-2" />
          </a>
        </li>
        {/* <li>
          <a
            className="flex items-center hover:text-foreground transition-colors"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/ErkanTurut"
          >
            <p>github</p>
            <ExternalLinkIcon className="ml-2" />
          </a>
        </li> */}
      </ul>
    </footer>
  );
}
