"use strict";
import { logger } from "./common/logger";

import { start } from "./start";

start().catch(err => {
  logger.error(`Error starting server: ${err.message}`);
  process.exit(-1);
});
