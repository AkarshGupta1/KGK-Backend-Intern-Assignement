const express = require('express');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const notifications = await Notification.findAll({ where: { user_id: req.user.id } });
  res.send(notifications);
});

router.post('/mark-read', authenticate, async (req, res) => {
  const { ids } = req.body;
  try {
    await Notification.update({ is_read: true }, { where: { id: ids, user_id: req.user.id } });
    res.send({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;


