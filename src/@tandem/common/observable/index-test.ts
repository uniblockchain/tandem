import { CoreEvent } from "../messages";
import { Observable } from "./index";
import { expect } from "chai";
import { CallbackDispatcher } from "@tandem/mesh";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Observable();
  });

  it("can observe the observable for any action", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: action => i++
    });

    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
  });

  it("can add multiple observers the observable for any action", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: action => i++
    });
    obs.observe({
      dispatch: action => i++
    });
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(2);
  });

  it("can immediately stop an action from propagating", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: (action) => { i++; action.stopImmediatePropagation(); }
    });
    obs.observe({
      dispatch: action => i++
    });
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
  });

  it("can stop an action from bubbling", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: (action) => {
        if (i > 0) action.stopPropagation();
      }
    });

    const obs2 = new Observable();

    obs2.observe({
      dispatch: action => i++
    });

    obs.observe({ dispatch: obs2.notify.bind(obs2) });
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
  });

  it("can unobserve an observable", () => {
    const obs = new Observable();
    let i = 0;
    const observer = new CallbackDispatcher(() => i++);
    obs.observe(observer);
    obs.notify(new CoreEvent("a"));
    expect(i).to.equal(1);
    obs.unobserve(observer);
    obs.notify(new CoreEvent("a"));
    expect(i).to.equal(1);
  });
});