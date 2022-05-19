import { ConfigurationService } from "./services/configuration.service";
import { LoginService } from "./services/login.service";

export function initServicesFactory(
  configurationService: ConfigurationService,
  loggingService: LoginService
) {
  return async () => {
    console.log('initServicesFactory - started');
    const config = await configurationService.loadConfiguration();
    console.log("login config:", config.userName, config.password);
    await loggingService.initialize(config.userName, config.password);
    console.log('initServicesFactory - completed');
  };
}