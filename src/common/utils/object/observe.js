import { NoopBus } from 'mesh';

const noopBus = NoopBus.create();

class Observable {
  constructor(target, parentBus) {
    this.target    = target;
    this.parentBus = parentBus || noopBus;
  }

  addObserver(observer) {
    if (!this._observers) {
      this._observers = observer;
    } else if (!Array.isArray(observer)) {
      this._observers = [this._observers, oberver];
    } else {
      this._observers.push(observer);
    }
  }

  removeObserver(observer) {
    if (this._observers === observer) {
      this._observers = void 0;
    } else {
      var i = this._observers.indexOf(observer);
      if (~i) this._observers.splice(i, 1);
    }
  }

  execute(event) {
    if (!event.canPropagate) return;

    event.currentTarget = this.target;

    if (this._observers) {
      if (Array.isArray(this._observers)) {
        for (var observer of this._observers) {
          observer.execute(event);
        }
      } else {
        this._observers.execute(event);
      }
    }

    if (event.canPropagate !== false) {
      this.parentBus.execute(event);
    }
  }
}

export function observe(target, observer) {
  getObservable(target).addObserver(observer);
}

export function unobserve(target, observer) {
  getObservable(target).removeObserver(observer);
}

function getObservable(target) {
  return target.__observable || (target.__observable = target.bus = new Observable(target, target.bus));
}