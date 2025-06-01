export const mapIdToColumnName = (id) => {
  switch (id) {
    case "todo":
      return "To Do";
    case "inprogress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return id;
  }
};

export const mapColumnNameToId = (name) => {
  switch (name) {
    case "To Do":
      return "todo";
    case "In Progress":
      return "inprogress";
    case "Done":
      return "done";
    default:
      return name.toLowerCase();
  }
};
