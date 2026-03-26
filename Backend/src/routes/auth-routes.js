const express            = require('express');
const router             = express.Router();
const { login, logout }  = require('../controllers/auth-controller');
const { loginRules }     = require('../validators/auth-validator');
const validate           = require('../middlewares/validate-middleware');

router.post('/login',  loginRules, validate, login);
router.post('/logout', logout);

module.exports = router;
 