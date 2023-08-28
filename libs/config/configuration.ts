import type {
  Config,
  Default,
  Development,
  Objectype,
} from './config.interface';

const util = {
  isObject<T>(value: T): value is T & Objectype {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },
  merge<T extends Objectype, U extends Objectype>(target: T, source: U): T & U {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (this.isObject(targetValue) && this.isObject(sourceValue)) {
        Object.assign(sourceValue, this.merge(targetValue, sourceValue));
      }
    }
    return { ...target, ...source };
  },
};

export const configuration = async (): Promise<Config | Default> => {
  const { config } = <{ config: Default }>(
    await import('@lib/config/envs/default')
  );

  const { config: environment } = <{ config: Development }>(
    await import('@lib/config/envs/development')
  );
  return util.merge(config, environment);
};
