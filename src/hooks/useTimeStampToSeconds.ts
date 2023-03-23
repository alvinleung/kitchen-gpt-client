import React from "react";

export function useTimeStampToSeconds(timestamp: string): number {
  const timeArray = timestamp
    .replace("[", "")
    .replace("]", "")
    .split(":")
    .map(Number);
  const [hours, minutes, seconds] = timeArray;

  return hours * 3600 + minutes * 60 + seconds;
}
