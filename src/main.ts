#!/usr/bin/env node

import 'reflect-metadata';
import { Application } from './application/app.js';

const application = new Application();
await application.run();
