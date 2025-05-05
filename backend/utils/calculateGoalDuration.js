const calculateDuration = (startTime, completedAt, pausePeriods) => {
  const start = new Date(startTime);
  const end = new Date(completedAt);

  if (isNaN(start) || isNaN(end)) {
    console.warn('Invalid start or end time');
    return { days: 0, hours: 0, minutes: 0 };
  }

  const totalTime = end.getTime() - start.getTime();

  let pausedTime = 0;
  for (const period of pausePeriods) {
    if (period.pausedAt) {
      const paused = new Date(period.pausedAt);
      const resumed = period.resumedAt ? new Date(period.resumedAt) : end;

      if (!isNaN(paused) && !isNaN(resumed)) {
        pausedTime += resumed.getTime() - paused.getTime();
      }
    }
  }

  const activeTime = totalTime - pausedTime;

  const totalMinutes = Math.max(0, Math.floor(activeTime / (1000 * 60))); // avoid negative
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
};
module.exports=calculateDuration