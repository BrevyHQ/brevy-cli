import { join } from 'path';
import { rm } from 'fs/promises';
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

  private get filesystemSeparatorChar() {
    if (process.platform === 'win32') {
      return '\\';
    }

    return '/';
  }

  private get filesystemRoot() {
    return mustExist(this._filesystemRoot);
  }

  private get resourcesRoot() {
    return mustExist(this.filesystemRoot.first((node) => node.model.id.endsWith('resources')));
  }

  private get librariesRoot() {
    return mustExist(this.filesystemRoot.first((node) => node.model.id.endsWith('libraries')));
  }

  public get filesystemRootDir() {
    return mustExist(this.filesystemRoot.model.id);
  }

  public get apigenTemplatesDirectory() {
    const templates = this.filesystemRoot.first((node) => node.model.id.endsWith('templates'));
    return mustExist(templates).model.id;
  }

  public async initialize() {
    await this.mapMonorepoDirectory();
  }

  public getProjectNames(root: ProjectRoot) {
    const projectRoot = root === ProjectRoot.Server ? this.serverRoot : this.clientRoot;
    const projects = projectRoot?.children;
    const mapProject = (project: TreeNode<FilesystemEntry>) =>
      mustExist(project.model.id.split(this.filesystemSeparatorChar).pop());
    return projects?.map(mapProject).filter((project) => project !== '_templates') || [];
  }

  public getApigenSchemaFilepath(project: string) {
    const schemas = this.resourcesRoot.first((node) => node.model.id.endsWith('schemas'));
    const schemasDirectory = mustExist(schemas).model.id;
    return join(schemasDirectory, `/${project}-api-schema.json`);
  }

  public getApigenOutputDirectory(project: string) {
    const librariesDirectory = this.librariesRoot.model.id;
    return join(librariesDirectory, `/client/${project}-api-client`);
  }


  public get apigenConfigFilepath() {
    return join(this.filesystemRootDir, 'openapitools.json');
  }

  public getTemplateNames(root: ProjectRoot) {
    const projectRoot = root === ProjectRoot.Server ? this.serverRoot : this.clientRoot;
    const templates = projectRoot?.children.find((node) =>
      node.model.id.endsWith('_templates'),
    )?.children;

    const mapProject = (project: TreeNode<FilesystemEntry>) => project.model.id.split(this.filesystemSeparatorChar).pop();
    return templates?.map(mapProject).filter((project) => project !== '_templates') || [];
  }

  public getProjectModulesByProjectName(name: string): Array<string> {
    const project = this.getProjectByName(name);
    const modules = mustExist(project.first((node) => node.model.id.endsWith('modules'))).children;
    const mapModule = (module: TreeNode<FilesystemEntry>) =>
      mustExist(module.model.id.split(this.filesystemSeparatorChar).pop());
    return modules.map(mapModule);
  }

  public getProjectByName(name: string) {
    const matchProject = (node: TreeNode<FilesystemEntry>) =>
      node.model.id.split(this.filesystemSeparatorChar).pop() === name;

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

  public async removeDirectory(path: string) {
    await rm(path, { recursive: true, force: true });
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
