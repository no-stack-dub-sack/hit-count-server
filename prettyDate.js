const monthKey = ['Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.','Aug.','Sep.','Oct.', 'Nov.','Dec.'];

const prettyDate = (date) => {
    const month = date.getMonth(),
          day = date.getDate(),
          year = date.getFullYear();

    const suffix = /21$|31$|^1$/.test(day)
        ? 'st'
        : /22$|^2$/.test(day)
        ? 'nd' : /23$|^3$/.test(day)
        ? 'rd'
        : 'th';

    return `${monthKey[month]} ${day}${suffix} ${year}`;
};

module.exports = prettyDate;
