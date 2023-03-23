import React from "react";

export function useOptimizeTranscript(input: string) {
  const splitTimeandString = input.split(/\r?\n/);

  const transcriptArray: any[][] = [];

  function useTimeStampToSeconds(timestamp: string): number {
    const timeArray = timestamp
      .replace("[", "")
      .replace("]", "")
      .split(":")
      .map(Number);
    const [hours, minutes, seconds] = timeArray;

    return hours * 3600 + minutes * 60 + seconds;
  }

  function splitTimeandTranscript(input: string) {
    const timestamp = input.slice(1, 9);
    const secondsTimestamp = useTimeStampToSeconds(timestamp);
    const message = input.slice(12);
    return [secondsTimestamp, message];
  }

  splitTimeandString.forEach((index) => {
    const processedSplit = splitTimeandTranscript(index);
    transcriptArray.push(processedSplit);
  });

  return transcriptArray;
}
