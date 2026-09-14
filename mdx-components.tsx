import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/CodeBlock";
import { MdxLink } from "@/components/MdxLink";
import { ResponsiveTable } from "@/components/ResponsiveTable";

export function useMDXComponents(): MDXComponents {
  return {
    a: MdxLink,
    pre: CodeBlock,
    table: ResponsiveTable,
  };
}
