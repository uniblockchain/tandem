import * as path from "path";
import * as memoize from "memoizee";

import { pull, values } from "lodash";
import { IFileSystem } from "../file-system";
import { RawSourceMap } from "source-map";
import { IDependencyGraph } from "./graph";
import { DependencyAction } from "./actions";
import { FileCache, FileCacheItem } from "../file-cache";

import {
  IDependencyLoaderResult,
  IResolvedDependencyInfo,
} from "./strategies"

import {
  FileCacheProvider,
  FileSystemProvider,
} from "../providers";

import { WrapBus } from "mesh";

import {
  Action,
  inject,
  Logger,
  IActor,
  loggable,
  Injector,
  LogLevel,
  IWalkable,
  Observable,
  TreeWalker,
  IInjectable,
  Status,
  serialize,
  deserialize,
  serializable,
  bindable,
  ITreeWalker,
  watchProperty,
  MimeTypeProvider,
  BaseActiveRecord,
  InjectorProvider,
  PropertyChangeAction,
  PLAIN_TEXT_MIME_TYPE,
  DisposableCollection,
} from "@tandem/common";

import { Dependency } from "./dependency";
import { DependencyWalker, flattenDependencies } from "./utils";

const RELOAD_TIMEOUT = 1000 * 3;

@loggable()
export class DependencyGraphWatcher extends Observable {
  protected readonly logger: Logger;

  private _dependencyObserver: IActor;
  private _dependencyObservers: DisposableCollection;
  private _resolve: any;

  @bindable(true)
  public status: Status;

  constructor(readonly entry: Dependency) {
    super();
    this._dependencyObserver = new WrapBus(this.onDependencyAction.bind(this));
  }

  public dispose() {
    this._dependencyObservers.dispose();
    this._dependencyObservers = undefined;
  }

  public waitForAllDependencies = memoize(async () => {
    this.status = new Status(Status.LOADING);

    let deps: Dependency[];

    try {
      while (true) {
        await this.entry.load();

        deps = flattenDependencies(this.entry);

        const loadingDependencies = deps.filter(dep => dep.status.type === Status.LOADING);

        // Break if everything is loaded in the dependency graph starting from this instance.
        // if there were loading deps, then there may be more imported deps that are being loaded in,
        // so we'll need to re-traverse the entire DEP graph to ensure that they're checked.
        if (!loadingDependencies.length) break;

        this.logger.verbose(`Waiting for ${loadingDependencies.length} dependencies to load`);

        await Promise.all(loadingDependencies.map(dep => dep.load()));
      }
    } catch(e) {
      this.status = new Status(Status.ERROR, e);

      // watch whatever is currently loaded in
      this.watchDependencies();
      throw e;
    }

    this.watchDependencies();

    this.status = new Status(Status.COMPLETED);

  }, { promise: true })

  private watchDependencies() {
    if (this._dependencyObservers) {
      this._dependencyObservers.dispose();
    }

    this._dependencyObservers = new DisposableCollection();

    for (const dep of flattenDependencies(this.entry)) {
      dep.observe(this._dependencyObserver);
      this._dependencyObservers.push({
        dispose: () => dep.unobserve(this._dependencyObserver)
      })
    }
  }


  private onDependencyAction(action: Action) {
    if (this.status && this.status.type === Status.LOADING) return;
    this.waitForAllDependencies["clear"]();
    this.waitForAllDependencies();
  }
}
