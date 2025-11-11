import Link from "next/link";
import Image from "next/image";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React from "react";

import { cn, slugify } from "@/lib/utils";
import * as RadixIcons from "@radix-ui/react-icons";

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        {...props}
        className="underline underline-offset-2 decoration-1 "
      >
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className=" underline underline-offset-2 decoration-1"
    />
  );
}

function MDXImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const href = typeof props.src === "string" ? props.src : undefined;

  return (
    <div className="relative inline-block group">
      <img
        {...props}
        className={cn(
          props.className,
          "rounded-md border border-border dark:bg-foreground"
        )}
      />
      {href ? (
        <Link
          href={href}
          className="absolute top-2 right-2 z-10 rounded-sm p-1 text-xs text-muted-foreground font-medium backdrop-blur hover:bg-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <RadixIcons.CornersIcon />
        </Link>
      ) : null}
    </div>
  );
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components: MDXRemoteProps["components"] = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: MDXImg,
  a: CustomLink,
  code: Code,
  Table,
  ...RadixIcons,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
