const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    let root = await User.findOne({ email: 'admin@researchradar.com' });
    if (!root) {
      root = new User({
        name: 'Root Admin',
        email: 'admin@researchradar.com',
        password: 'adminpassword', // in a real app this would be hashed
        role: 'root'
      });
      await root.save();
      console.log('Root user created.');
    } else {
      root.role = 'root';
      await root.save();
      console.log('Existing admin user role updated to root.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
