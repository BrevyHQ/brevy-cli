import { readdir, lstat } from 'fs/promises';
import { join, resolve } from 'path';
import { Dirent } from 'fs';
import { exists } from './exists.js';

export const getFilePathsRecursively = async (dir: string) => {
  let results: string[] = [];
  const list = await readdir(dir);

  let pending = list.length;
  if (!pending) return results;

  for (let file of list) {
    file = resolve(dir, file);

    // eslint-disable-next-line no-await-in-loop
    const stat = await lstat(file);

    if (stat && stat.isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      results = results.concat(await getFilePathsRecursively(file));
    } else {
      results.push(file);
    }

    if (!--pending) return results;
  }

  return results;
};

export type FilesystemEntry = {
  id: string;
  children: Array<FilesystemEntry>;
};

export const getDirectoriesRecursively = async (
  path: string,
  exclude: Array<string> = [],
): Promise<FilesystemEntry> => {
  return Promise.all(
    (await readdir(path, { withFileTypes: true })).map((dirent: Dirent) => {
      if (dirent.isDirectory() && !exclude.includes(dirent.name)) {
        return getDirectoriesRecursively(join(path, dirent.name), exclude);
      }

      return null;
    }),
  ).then((results) => ({ id: path, children: results.filter(exists) }));
};
