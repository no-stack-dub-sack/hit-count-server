const calculateDayRange = (startDate, currentDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    Math.abs(
      (startDate.getTime() - currentDate.getTime()) / (oneDay)
    )
  );
}

module.exports = calculateDayRange;
