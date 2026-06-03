import Product from '../models/Product.js';
import Setting from '../models/Setting.js';

export const getHomepageData = async (req, res) => {
  try {
    const featured = await Product.find({ showOnHomePage: true, homePageSection: 'featured', isActive: true }).sort({ homePageOrder: 1 });
    const famous = await Product.find({ showOnHomePage: true, homePageSection: 'famous', isActive: true }).sort({ homePageOrder: 1 });
    const newItems = await Product.find({ showOnHomePage: true, homePageSection: 'new', isActive: true }).sort({ homePageOrder: 1 });
    
    res.json({
      featured,
      famous,
      new: newItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBanner = async (req, res) => {
  try {
    const bannerSetting = await Setting.findOne({ key: 'homepage_banner' });
    res.json({ bannerUrl: bannerSetting ? bannerSetting.value.url : '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const backendUrl = req.protocol + '://' + req.get('host');
    const url = `${backendUrl}/uploads/${req.file.filename}`;
    
    await Setting.findOneAndUpdate(
      { key: 'homepage_banner' },
      { key: 'homepage_banner', value: { url } },
      { upsert: true, new: true }
    );
    
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
