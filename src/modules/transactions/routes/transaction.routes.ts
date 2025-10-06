import { Router } from 'express';
import { validateCreateTransaction } from '../validators/transaction.validator';
import { HealthController } from '../controllers/health.controller';
import { basicAuth } from '../../../middlewares';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();
const transactionController = new TransactionController();
const healthController = new HealthController();

router.get('/health', healthController.check);
router.post('/', basicAuth, validateCreateTransaction, transactionController.createTransaction);

export default router;
