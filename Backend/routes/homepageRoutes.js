import express from 'express';
import Setting from '../models/Setting.js';

const router = express.Router();

router.get('/banner', async (req, res) => {
  try {
    const bannerSetting = await Setting.findOne({ key: 'homepage_banner' });
    res.json({ bannerUrl: bannerSetting ? bannerSetting.value.url : '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
