import moment from "moment";

export default (release: number | Date | string) => {
  const releaseToDate = new Date(release);
  const diff = moment(new Date()).diff(releaseToDate, "days") <= 21;
  return diff;
};
