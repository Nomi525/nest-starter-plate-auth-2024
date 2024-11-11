import { INestApplication } from "@nestjs/common";

type HotModule = {
  hot?: {
    accept: () => void,
    dispose: (data: () => void) => void
  }
} & NodeModule;

export const setupModuleHotReload = (module: HotModule, app: INestApplication): void => {
  if (module?.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};
