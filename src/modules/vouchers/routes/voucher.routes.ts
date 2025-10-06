import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller';
import { validateCreateVoucher, validateUpdateVoucher } from '../validators/voucher.validator';
import { HealthController } from '../controllers/health.controller';
import { jwtAuthNotRequired, jwtAuth } from '../../../middlewares';

const router = Router();
const voucherController = new VoucherController();
const healthController = new HealthController();

router.get('/health', healthController.check);
router.get('/:code/detail', jwtAuthNotRequired, voucherController.getVoucherByName);
router.get('/', jwtAuth, voucherController.getAllVouchers);
router.get('/today/used', jwtAuth, voucherController.getTodayUsedVouchers);
router.post('/', jwtAuth, validateCreateVoucher, voucherController.createVoucher);
router.put('/:id', jwtAuth, validateUpdateVoucher, voucherController.updateVoucher);
router.delete('/:id', jwtAuth, voucherController.deleteVoucher);

export default router;
