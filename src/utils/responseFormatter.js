// Utility function to format responses
const formatResponse = (status, message, data = null) => {
  return {
    status,
    message,
    ...(data && { data })
  };
};

module.exports = {
  formatResponse
};
