var express = require('express');
var router = express.Router();
const checkoutController = require('../controllers/checkout')
const exampleController = require('../controllers/example');

// Integración básica
router.get('/generar_preferencia', exampleController.demoCheckout);
router.get('/pago_exitoso', exampleController.successPayment);
router.get('/pago_rechazado', exampleController.failedPayment);

// Integración con base de datos
router.get('/', checkoutController.renderCheckout);
router.post('/', checkoutController.processCheckoutAndGeneratePreference);
router.get('/process', checkoutController.processPayment);


module.exports = router;
