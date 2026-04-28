import { readFileSync } from "fs";
import path from "path";

interface Props {
  file: string;
}

// Server Component — читает HTML-сниппет из lib/snippets/ и рендерит через
// dangerouslySetInnerHTML. Wrapper использует display: contents, чтобы не
// нарушать структуру Webflow CSS (секции должны быть прямыми детьми main).
export default function HtmlSection({ file }: Props) {
  const filePath = path.join(process.cwd(), "lib", "snippets", file);
  const html = readFileSync(filePath, "utf-8");
  return (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
