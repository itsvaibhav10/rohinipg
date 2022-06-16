const User = require('../models/user');
const schedule = require('node-schedule');
const utility = require('./utility');
var cron = require('node-cron');

module.exports = () => {
  // Package Expiry Job
  schedule.scheduleJob(`* 20 * * *`, async () => {
    const providers = await User.find(
      {
        typeOfUser: 'provider',
        packageId: { $exists: true },
      },
      { _id: true, firstName: true, lastName: true, mobile: true }
    ).lean();
    providers.forEach(async (p) => {
      const expired = await utility.isPackageExpired(p._id);
      if (expired)
        utility.sendSms(
          `Dear ${p.firstName},\nYour Package Got Expired\nPlease renew Your Package at\nrohinigirlspg.com/pricing`,
          p.mobile
        );
    });
  });

  cron.schedule(
    '0 0 */1 * * *',
    () => {
      const hour = new Date().getHours();
      utility.sendSms(`current - ${hour}`, '9015238030');
    },
    { timezone: 'Asia/Kolkata' }
  );
};
