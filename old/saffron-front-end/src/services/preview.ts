
import {
  loggable,
  IApplication,
  BaseApplicationService,
  ApplicationServiceFragment
} from 'sf-common/index';

const ZOOM_INCREMENT = 0.1;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;

interface IZoomable {
  zoom:number;
}

interface IObservable {
  setProperties(properties:any);
}

type ApplicationType = IApplication & IZoomable & IObservable;


export default class PreviewService extends BaseApplicationService<ApplicationType> {

  constructor(app:ApplicationType) {
    super(app);
    (app as any).zoom = 1;
  }

  zoomIn() {
    this.zoom({ delta: ZOOM_INCREMENT });
  }

  zoom({ delta }) {
    this.app.setProperties({
      zoom: Math.max(
        MIN_ZOOM_LEVEL,
        Math.min(
          MAX_ZOOM_LEVEL,
          (this.app.zoom || 1) + delta
        )
      )
    });
  }

  zoomOut() {
    this.zoom({ delta: -ZOOM_INCREMENT });
  }
}

export const fragment = new ApplicationServiceFragment('application/services/preview', PreviewService);