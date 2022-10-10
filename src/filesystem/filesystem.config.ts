interface IFilesystemConfig {
  exclude: Array<string>;
}

export const FilesystemConfig: IFilesystemConfig = {
  exclude: [
    'node_modules',
    'dist',
    'build',
    'coverage',
    'docs',
    'test',
    'tests',
    'spec',
    'specs',
    '.git',
  ],
};
