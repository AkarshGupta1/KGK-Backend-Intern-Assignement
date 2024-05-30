const express = require('express');
const Bid = require('../models/Bid');
const Item = require('../models/Item');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/:itemId/bids', async (req, res) => {
  const bids = await Bid.findAll({ where: { item_id: req.params.itemId } });
  res.send(bids);
});

router.post('/:itemId/bids', authenticate, async (req, res) => {
  const { bid_amount } = req.body;
  const item = await Item.findByPk(req.params.itemId);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  if (bid_amount <= item.current_price) {
    return res.status(400).send({ error: 'Bid amount must be higher than the current price' });
  }
  try {
    const bid = await Bid.create({ item_id: req.params.itemId, user_id: req.user.id, bid_amount });
    item.current_price = bid_amount;
    await item.save();
    res.status(201).send(bid);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;


