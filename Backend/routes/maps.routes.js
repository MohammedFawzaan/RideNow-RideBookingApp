import { Router } from 'express';
const router = Router();
import { authUser } from '../middlewares/auth.middleware.js';
import { getCoordinates } from '../controllers/map.controller';

router.get('/get-coordinates', authUser, getCoordinates);

export default router;