import { Router } from 'express'; // Import the Router from 'express'
import { fetchInitialMessages } from './controller/message.server.controller.js';

const router = Router(); // Create an instance of the Router

router.get('/initial-messages', fetchInitialMessages);

export default router; // Export the router instance
