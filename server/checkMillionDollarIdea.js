const checkMillionDollarIdea = (req, res, next) => {
  const { numWeeks, weeklyRevenue } = req.body;
  const numWeeksNum = Number(numWeeks);
  const weeklyRevenueNum = Number(weeklyRevenue);

  if (!Number.isFinite(numWeeksNum) || !Number.isFinite(weeklyRevenueNum) || numWeeksNum <= 0 || weeklyRevenueNum <= 0) {
    return res.status(400).send();
  }

  const totalYield = numWeeksNum * weeklyRevenueNum;
  if (totalYield < 1000000) {
    return res.status(400).send();
  }
  next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
