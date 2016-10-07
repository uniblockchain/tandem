import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { MetadataKeys } from "@tandem/editor/constants";
import { SelectAction } from "@tandem/editor/actions";
import { getCSSSelection } from "@tandem/html-extension/lang";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectWithCSSSelectorAction } from "@tandem/html-extension/actions";
import { CSSRuleEntity, CSSRuleExpression } from "@tandem/html-extension/lang";
import { LayerLabelComponentFactoryDependency } from "@tandem/editor/dependencies";

class CSSRuleLayerLabel extends React.Component<{ app: FrontEndApplication, workspace: Workspace, entity: CSSRuleEntity }, any> {

  render() {

    const selector = String(this.props.entity.source.selector).trim();

    return <span
      className="m-label m-css-rule-layer-label">
      <span className="entity other attribute-name" onDoubleClick={this.edit}>
        { selector }
      </span>
    </span>;
  }

  edit = () => {
    console.log("edit name");
  }

  onClick = (event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectWithCSSSelectorAction(this.props.entity.source));
  }

  // onMouseOver = (event: React.MouseEvent) => {
  //   this.props.entity.selectedHTMLEntities.forEach((entity) => {
  //     entity.metadata.set(MetadataKeys.HOVERING, true);
  //   });
  // }

  // onMouseOut = (event: React.MouseEvent) => {
  //   this.props.entity.selectedHTMLEntities.forEach((entity) => {
  //     entity.metadata.set(MetadataKeys.HOVERING, false);
  //   });
  // }
}

export const cssRuleLayerLabelComponentDependency = new LayerLabelComponentFactoryDependency(CSSRuleExpression.name, CSSRuleLayerLabel);