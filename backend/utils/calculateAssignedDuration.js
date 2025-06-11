const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate - startDate;

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return {
    days,
    hours,
    minutes
  };
};

module.exports = calculateDuration;