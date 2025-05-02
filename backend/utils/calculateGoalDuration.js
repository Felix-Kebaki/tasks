const calculateDuration = (startTime, completedAt, pausePeriods) => {
    const totalTime = new Date(completedAt) - new Date(startTime);
  
    let pausedTime = 0;
    for (const period of pausePeriods) {
      if (period.pausedAt && period.resumedAt) {
        pausedTime += new Date(period.resumedAt) - new Date(period.pausedAt);
      }
    }
  
    const activeTime = totalTime - pausedTime;
  
    // Convert milliseconds into days, hours, minutes
    const totalMinutes = Math.floor(activeTime / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
  
    return { days, hours, minutes };
  };

  
  module.exports=calculateDuration