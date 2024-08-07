import * as core from '@actions/core';
import { glob } from 'glob';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';

import PlatformConfig, { PlatformConfigFile } from '../models/platformConfig';

type ConfigFilesLoaderOptions = {
  scanRoot?: string;
  scanTimeoutMs?: number;
};

class ConfigFilesLoader {
  private configFilePaths: string[];
  private scanRoot: string;
  private scanTimeoutMs: number;
  
  constructor(opts?: ConfigFilesLoaderOptions) {
    this.configFilePaths = [`${__dirname}/cloudy.yml`];

    this.scanRoot = opts?.scanRoot || process.env.GITHUB_WORKSPACE || '.';
    this.scanTimeoutMs = opts?.scanTimeoutMs || 5000;

    const platformConfigFileExists = existsSync(this.configFilePaths[0]);
    if (!platformConfigFileExists) {
      core.setFailed('No platform configuration file found.');
    }

    const modulePath = core.getInput('module_path');
    const moduleConfigFileExists = existsSync(`${process.env.GITHUB_WORKSPACE}/${modulePath}/cloudy.yml`);
    if (!moduleConfigFileExists) {
      core.warning(`No cloudy configuration file found at ${modulePath}.`);
    }
  }

  public async loadPlatformConfig() {
    const rawPlatformConfig = await this.readFile<PlatformConfigFile>(this.configFilePaths[0]);
    console.log(rawPlatformConfig);
    if (!rawPlatformConfig) {
      core.setFailed('Failed to load platform configuration file.');
      return Promise.reject('Failed to load platform configuration file.');
    }

    const transformedPlatformConfig = this.convertSnakeCaseToCamelCase(rawPlatformConfig!);
    const projectName = transformedPlatformConfig!.project.name;
    const { tfState, environments } = transformedPlatformConfig!.platform;

    const platformConfig = new PlatformConfig(projectName, tfState, environments);
    return platformConfig;
  }
  
  async scanRepository() {
    const globSearchPattern = '**/cloudy.{y*ml,conf}';
    core.info(`Scanning repository for cloudy.yml files in ${this.scanRoot} using glob pattern "${globSearchPattern}" with a timeout of ${this.scanTimeoutMs}ms.`);
    
    const files = await glob(globSearchPattern, {
      cwd: this.scanRoot,
      absolute: true,
      ignore: ['**/node_modules/**'],
      signal: AbortSignal.timeout(this.scanTimeoutMs),
    });

    if (files.length === 0) {
      core.setFailed('No cloudy config files found in the repository.');
      return [];
    };
    core.info(`Found ${files.length} cloudy config file${files.length > 1 ? 's' : ''} in the repository.`);
    core.debug(`Files: ${files.join(', ')}`);

    this.configFilePaths = [...this.configFilePaths, ...files];
    return files;
  }

  private async readFile<T>(filePath: string) {
    let file: T;
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      file = yaml.load(fileContent) as T;
      core.debug(`Parsed Content ${JSON.stringify(file)}`);
      return file;
    } catch (error) {
      core.setFailed(`Error loading ${filePath}: ${error}`);
    }
  }

  public convertSnakeCaseToCamelCase(obj: Record<string, any>): Record<string, any> {
    const convertedObj: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const camelCaseKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
        if (Array.isArray(value)) {
          convertedObj[camelCaseKey] = value.map((item) => {
            if (typeof item === 'object' && item !== null) {
              return this.convertSnakeCaseToCamelCase(item);
            }
            return item;
          });
        } else if (typeof value === 'object' && value !== null) {
          convertedObj[camelCaseKey] = this.convertSnakeCaseToCamelCase(value);
        } else {
          convertedObj[camelCaseKey] = value;
        }
      }
    }
    return convertedObj;
  }
}

export default ConfigFilesLoader;
