import * as fs from 'fs/promises';
import * as path from 'path';

const ROOT_PATH = path.dirname(__dirname);
const DOCS_PATH = path.join(ROOT_PATH, '..', 'docs');

const getFilesFromDir = async (dir: string): Promise<string[]> => {
  const fileNames = await fs.readdir(dir);
  const files: string[] = [];
  for (const file of fileNames) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      const subfiles = await getFilesFromDir(filePath);
      files.push(...subfiles);
    } else {
      files.push(filePath);
    }
  }
  return files;
};

const fixFile = async (
  fileContent: string,
  oldLink: string,
  newLink: string,
  matches: RegExpMatchArray,
) => {
  const linkOffsetLength = matches[0].indexOf(matches[3]);
  const startIndex = (matches.index ?? 0) + linkOffsetLength;
  const oldLinkLength = oldLink.length;
  const firstPart = fileContent.substring(0, startIndex);
  const secondPart = fileContent.substring(startIndex + oldLinkLength);
  return `${firstPart}${newLink}${secondPart}`;
};

const checkFile = async (file: string) => {
  const originalFileContent = (await fs.readFile(file)).toString('utf-8');
  const allMatches = originalFileContent.matchAll(/(<li>)?[^<]*(<a[^>]+href="([^"]+)"[^>]*>)/g);
  if (allMatches) {
    let fileContentPromise = Promise.resolve(originalFileContent);
    Array.from(allMatches)
      .reverse()
      .forEach((matches) => {
        fileContentPromise = fileContentPromise.then(async (fileContent) => {
          if (!matches) return fileContent;
          // We don't want to replace links in the left menu
          if (matches[1] === '<li>') return fileContent;

          const link = matches[3];
          // Skip links which points to an anchor or an external site
          if (link.startsWith('#') || link.startsWith('http')) return fileContent;

          // Skip links which don't point to the 'variables' directory
          if (!/[\\/]variables[\\/]/.test(link)) return fileContent;

          // Link used in the html file
          let newLink = link.replace(/([\\/])variables([\\/])/, '$1interfaces$2');

          // Path to a real file
          let newUrlLink = path.join(path.dirname(file), ...newLink.split(/\\\//));
          try {
            const isFile = (await fs.stat(newUrlLink)).isFile();
            if (isFile) {
              const newFileContent = await fixFile(fileContent, link, newLink, matches);
              return newFileContent;
            }
          } catch (err) {
            // Skip this link
          }

          // Some of the generated files in the 'variables' folder have the '-1.html' suffix,
          // but files in the 'interfaces' folder don't, so try to remove the number from there
          if (/-\d+\.html$/.test(newUrlLink)) {
            newUrlLink = newUrlLink.replace(/(^.*)-\d+(\.html)$/, '$1$2');
            newLink = newLink.replace(/(^.*)-\d+(\.html)$/, '$1$2');
            try {
              const isFile = (await fs.stat(newUrlLink)).isFile();
              if (isFile) {
                const newFileContent = await fixFile(fileContent, link, newLink, matches);
                return newFileContent;
              }
            } catch (err) {
              // Skip this link
            }
          }

          return fileContent;
        });
      });

    const finalFileContent = await fileContentPromise;
    await fs.writeFile(file, finalFileContent, { encoding: 'utf-8' });
  }
};

getFilesFromDir(DOCS_PATH).then(async (files) => {
  await Promise.all(
    files.map(async (file) => {
      // We only want to fix html files
      if (file.endsWith('.html')) {
        await checkFile(file);
      }
    }),
  );
});
