import {
    calculateDuration,
    formatDuration as formatDuration_,
} from "../../card/durationCalculating";


export const formatDuration = (duration) => {
    const o = calculateDuration(duration);
    o.includeZeroHours = true;
    return formatDuration_(o);
}