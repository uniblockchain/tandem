import { CoreEvent, MutationEvent, TreeNodeMutationTypes } from "@tandem/common";
import { ISyntheticBrowserOpenOptions } from "@tandem/synthetic-browser";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser/dom/css";
import {
  isDOMNodeMutation,
  isCSSMutation,
  CSSGroupingRuleMutationTypes,
  SyntheticDocumentMutationTypes,
  SyntheticDOMElementMutationTypes,
  SyntheticCSSStyleRuleMutationTypes,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
} from "@tandem/synthetic-browser/dom";

export class DOMNodeEvent extends CoreEvent {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class SyntheticRendererEvent extends CoreEvent {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
}

export class OpenRemoteBrowserRequest extends CoreEvent {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly options: ISyntheticBrowserOpenOptions) {
    super(OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER);
  }
}
