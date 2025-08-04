//function to convert date js date object into mm-dd-yyyy format
module.exports.dateForHTMLForm = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
};

//function to fix the issue to date displayed(due to the timeZone difference) in the show page
module.exports.convertToZ = (date) => {
  const currentHours = date.getHours();
  const offset = date.getTimezoneOffset();
  const hoursTobeAdded = offset / 60;
  date.setHours(currentHours + hoursTobeAdded);
  console.log(date);
  return date;
};
