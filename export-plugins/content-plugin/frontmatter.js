function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  if (!match) return { data: {}, content: markdown };
  const frontmatterText = match[1];
  const body = match[2];
  const data = {};
  for (const line of frontmatterText.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
      data[key] = value;
      continue;
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter((item) => item.length > 0);
      continue;
    }
    if (value === "true") {
      data[key] = true;
      continue;
    }
    if (value === "false") {
      data[key] = false;
      continue;
    }
    if (value !== "" && !Number.isNaN(Number(value))) {
      data[key] = Number(value);
      continue;
    }
    data[key] = value;
  }
  return { data, content: body.trim() };
}
export {
  parseFrontmatter
};
