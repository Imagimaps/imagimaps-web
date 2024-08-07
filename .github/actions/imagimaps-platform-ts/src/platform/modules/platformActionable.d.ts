interface PlatformActionable {
  async checkDependentInfrastructure(): Promise<string[]>;
  async deployDependencies(dependencies: string[]): Promise<void>;
  async build(): Promise<void>;
  async deploy(): Promise<void>;
}

export default PlatformActionable;
