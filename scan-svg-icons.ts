import * as fs from "fs";
import * as path from "path";

interface SvgIcon {
  id: string;
  name: string;
  path: string;
  keywords: string[];
}

interface IconGroup {
  name: string;
  items: SvgIcon[];
}

/**
 * Scans the /public/svg directory and generates icon group entries
 * for your iconData.ts file
 */
function scanSvgDirectory(baseDir: string = "./public/svg"): IconGroup[] {
  const iconGroups: IconGroup[] = [];

  try {
    // Read all folders in the svg directory
    const folders = fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folderName) => {
      const folderPath = path.join(baseDir, folderName);

      // Read all SVG files in this folder
      const svgFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".svg"));

      if (svgFiles.length > 0) {
        const items: SvgIcon[] = svgFiles.map((file) => {
          const fileName = path.parse(file).name; // Remove .svg extension

          return {
            id: fileName,
            name: fileName,
            path: `/svg/${folderName}/${file}`,
            keywords: [folderName],
          };
        });

        iconGroups.push({
          name: folderName,
          items: items,
        });
      }
    });

    return iconGroups;
  } catch (error) {
    console.error("Error scanning SVG directory:", error);
    return [];
  }
}

/**
 * Generates the TypeScript code to add to your iconData.ts
 */
function generateIconDataCode(iconGroups: IconGroup[]): string {
  const code = iconGroups
    .map((group) => {
      const itemsCode = group.items
        .map(
          (item) =>
            `      {
        id: "${item.id}",
        name: "${item.name}",
        path: "${item.path}",
        keywords: ${JSON.stringify(item.keywords)},
      }`
        )
        .join(",\n");

      return `  {
    name: "${group.name}",
    items: [
${itemsCode}
    ],
  }`;
    })
    .join(",\n");

  return code;
}

/**
 * Main function to scan and output results
 */
function main(): void {
  const svgDir: string = process.argv[2] || "./public/svg";

  console.log(`Scanning directory: ${svgDir}\n`);

  const iconGroups = scanSvgDirectory(svgDir);

  if (iconGroups.length === 0) {
    console.log("No SVG folders found or directory does not exist.");
    return;
  }

  console.log(`Found ${iconGroups.length} icon groups:\n`);

  iconGroups.forEach((group) => {
    console.log(`- ${group.name}: ${group.items.length} icons`);
  });

  console.log("\n--- Generated Code ---\n");
  console.log(generateIconDataCode(iconGroups));

  // Optionally write to file
  const outputFile = "svg-icons-output.ts";
  const fullCode = `// Auto-generated SVG icons from /public/svg\n\n${generateIconDataCode(
    iconGroups
  )}`;

  fs.writeFileSync(outputFile, fullCode);
  console.log(`\n\nCode also saved to: ${outputFile}`);
}

// Run the script
main();
