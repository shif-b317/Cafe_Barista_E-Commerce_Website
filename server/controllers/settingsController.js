const Settings = require('../models/Settings');

// @desc    Get cafe settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    
    // Create default settings if not exists
    if (!settings) {
      settings = new Settings({
        cafeName: 'Café Barista',
        logo: '',
        contactEmail: 'info@cafebarista.com',
        phone: '+91 8763456297',
        deliveryCharges: 50,
        gstPercentage: 5,
        openingHours: '8:00 AM - 10:00 PM'
      });
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cafe settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const { cafeName, logo, contactEmail, phone, deliveryCharges, gstPercentage, openingHours } = req.body;

    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = new Settings({});
    }

    settings.cafeName = cafeName !== undefined ? cafeName : settings.cafeName;
    settings.logo = logo !== undefined ? logo : settings.logo;
    settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
    settings.phone = phone !== undefined ? phone : settings.phone;
    settings.deliveryCharges = deliveryCharges !== undefined ? deliveryCharges : settings.deliveryCharges;
    settings.gstPercentage = gstPercentage !== undefined ? gstPercentage : settings.gstPercentage;
    settings.openingHours = openingHours !== undefined ? openingHours : settings.openingHours;

    const updatedSettings = await settings.save();
    res.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
