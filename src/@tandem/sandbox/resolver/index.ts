// TODO - this is deprecated. Move to strategies/default

import fs =  require("fs");
import memoize =  require("memoizee");

import { IFileResolver } from "../resolver";
import { ResolveFileRequest } from "../messages";
import { IDispatcher, readOneChunk } from "@tandem/mesh";
import {
  inject,
  Logger,
  Injector,
  loggable,
  InjectorProvider,
  MimeTypeProvider,
  PrivateBusProvider,
} from "@tandem/common";
import resolve =  require("resolve");
import pkgpath = require("package-path");

export interface IFileResolverOptions {
  extensions: string[];
  directories: string[];
}

export interface IFileResolver {
  resolve(uri: string, cwd?: string, options?: IFileResolverOptions): Promise<string>;
}

const createFileResolverOptions = (extensions?: string[], directories?: string[]): IFileResolverOptions => {
  return {
    extensions: extensions || [],
    directories: directories || []
  }
}

const combineResoverOptions = (...options: IFileResolverOptions[]): IFileResolverOptions => {
  return options.reduce((a, b) => {
    if (!a) a = createFileResolverOptions();
    if (!b) b = createFileResolverOptions();
    return {
      extensions: a.extensions.concat(b.extensions),
      directories: a.directories.concat(b.directories)
    };
  });
}

@loggable()
export abstract class BaseFileResolver implements IFileResolver {
  private _cache: any;
  public options: IFileResolverOptions;
  protected logger: Logger;

  constructor() {
    this._cache = {};
    this.options = createFileResolverOptions();
  }

  // TODO - there will be cases where we want to bust the cache on this.
  resolve = memoize(async (relativePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string> => {
    return this.resolve2(relativePath, cwd, combineResoverOptions(this.options, options));
  }, { promise: true, normalizer: ([relativePath, cwd, options]) => relativePath + cwd + JSON.stringify(options) })

  protected abstract async resolve2(uri: string, cwd?: string, options?: IFileResolverOptions): Promise<string>;
}

export class RemoteFileResolver extends BaseFileResolver {
  @inject(PrivateBusProvider.ID)
  private _bus: IDispatcher<any, any>;

  async resolve2(uri: string, cwd?: string, options?: IFileResolverOptions): Promise<string> {
    return (await readOneChunk<string>(this._bus.dispatch(new ResolveFileRequest(uri, cwd, options)))).value;
  }
}

export class LocalFileResolver extends BaseFileResolver {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async resolve2(relativePath: string, cwd?: string, options?: IFileResolverOptions): Promise<string> {

    // do not resolve not file: protocols
    if (/\w+:\/\//.test(relativePath) && relativePath.indexOf("file:") !== 0) {
      return relativePath;
    }

    // quick fix -- cwd 
    if (cwd && cwd.indexOf("file:") !== 0) {
      return relativePath;
    }

    cwd = cwd && cwd.replace("file://", "");
    relativePath = relativePath.replace("file://", "");



    const { extensions, directories } = combineResoverOptions(options, {
      extensions: [], // temp
      directories: []
    });

    let modulesBaseDir = cwd;

    if (cwd) {
      const pkgPath = fs.existsSync(cwd + "/package.json") ? cwd : pkgpath.sync(cwd);

      const pkg = pkgPath && JSON.parse(fs.readFileSync(pkgPath + "/package.json", "utf8"));

      // check browser flag in package.json

      if (!/^(\.|\/)/.test(relativePath)) {
        modulesBaseDir = pkgPath;
      }


      if (pkg && pkg.browser && pkg.browser[relativePath] != null) {
        relativePath = pkg.browser[relativePath];
      }

      directories.push(modulesBaseDir + "/node_modules");

      if (<boolean><any>relativePath === false) return Promise.resolve(undefined);
    } else {
      modulesBaseDir = process.cwd();
    }

    // override resolve js functionality here -- directories here are
    // typically scanned in the beginning. We want to resolve from node_modules
    // after the target directories.
    directories.push(...modulesBaseDir.split("/").map((dir, index, parts) => {
      return parts.slice(0, index + 1).join("/") + "/node_modules";
    }), cwd);

    const resolvedPath = resolve.sync(relativePath, {
      basedir: modulesBaseDir,
      extensions: extensions,
      paths: directories.filter(dir => !!dir),

      // moduleDirectory is required, but it foos with
      // dependency resolution. Solution: give a directory that doesn't have anything
      moduleDirectory: "/i/should/not/exist",

      packageFilter: (pkg, uri) => {
        const main = (pkg.browser && typeof pkg.browser === "object" ? pkg.browser[pkg.main] : pkg.browser) || pkg.main;
        return {
          main: main
        }
      }
    });

    this.logger.debug(`Resolved ${relativePath}:${resolvedPath}`);

    return "file://" + resolvedPath;
  }
}