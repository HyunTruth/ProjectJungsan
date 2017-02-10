const express = require('express');

const router = express.Router();
const controller = require('../controller/index');

/* GET home page. */
router.route('/')
.get(controller.landing.get);

router.route('/groupedit*')
.get(controller.groupedit.get)
.post(controller.groupedit.post)
.put(controller.groupedit.put);

router.route('/mypage')
.get(controller.myPage.get);

router.route('/transaction')
.get(controller.transaction.get)
.post(controller.transaction.post);

router.route('/history')
.get(controller.history.get)
.put(controller.history.put);

router.route('/total')
.put(controller.total.put);


module.exports = router;
