import { join } from 'path';
import { CliConfigKey, Config } from './config.js';
import { FilesystemEntry, getDirectoriesRecursively } from '../utility/paths.js';
import { FilesystemConfig } from './filesystem.config.js';
import { exists, mustExist } from '../utility/exists.js';
import { TreeNode } from '../tree/treeNode.js';
import { Tree } from '../tree/tree.js';

export enum ProjectRoot {
  Server = 'server',
  Client = 'client',
}

class ApplicationFilesystem {
  private _filesystemRoot: TreeNode<FilesystemEntry> | undefined;

  private serverRoot: TreeNode<FilesystemEntry> | undefined;
  private clientRoot: TreeNode<FilesystemEntry> | undefined;

  private set filesystemRoot(root: TreeNode<FilesystemEntry>) {
    this._filesystemRoot = root;
  }

  private get filesystemRoot() {
    return mustExist(this._filesystemRoot);
  }

  public getProjectNames(root: ProjectRoot) {
    const projectRoot = root === ProjectRoot.Server ? this.serverRoot : this.clientRoot;
    const projects = projectRoot?.children;
    const mapProject = (project: TreeNode<FilesystemEntry>) => project.model.id.split('/').pop();
    return projects?.map(mapProject).filter((project) => project !== '_templates') || [];
  }

  public getTemplateNames(root: ProjectRoot) {
    const projectRoot = root === ProjectRoot.Server ? this.serverRoot : this.clientRoot;
    const templates = projectRoot?.children.find((node) =>
      node.model.id.endsWith('_templates'),
    )?.children;

    const mapProject = (project: TreeNode<FilesystemEntry>) => project.model.id.split('/').pop();
    return templates?.map(mapProject).filter((project) => project !== '_templates') || [];
  }

  public async initialize() {
    await this.mapMonorepoDirectory();
  }

  public getProjectByName(name: string) {
    const matchProject = (node: TreeNode<FilesystemEntry>) =>
      node.model.id.split('/').pop() === name;

    const clientProject = this.clientRoot?.children.find(matchProject);
    if (exists(clientProject)) {
      return clientProject;
    }

    const serverProject = this.serverRoot?.children.find(matchProject);
    if (exists(serverProject)) {
      return serverProject;
    }

    throw new Error('Project with that name does not exist!');
  }

  public getProjectCategoryCwd(project: TreeNode<FilesystemEntry>) {
    const isServer = this.serverRoot?.children.includes(project);
    if (isServer) {
      return mustExist(this.serverRoot).model.id;
    }

    const isClient = this.clientRoot?.children.includes(project);
    if (isClient) {
      return mustExist(this.clientRoot).model.id;
    }

    throw new Error('Project is not in a known category!');
  }

  private async mapMonorepoDirectory() {
    const monorepoPath = Config.get(CliConfigKey.MonorepoPath);
    const filePaths = await getDirectoriesRecursively(monorepoPath, FilesystemConfig.exclude);
    this.filesystemRoot = new Tree().parse(filePaths);

    this.serverRoot = this.getRootNode('server');
    this.clientRoot = this.getRootNode('client');
  }

  private getRootNode(name: string) {
    const monorepoPath = Config.get(CliConfigKey.MonorepoPath);
    return this.filesystemRoot.first((node) => node.model.id === join(monorepoPath, name));
  }
}

export const Filesystem = new ApplicationFilesystem();
