import React, { ProfilerOnRenderCallback, ProfilerProps } from "react";

type Props = { metadata?: any; phase?: ("mount" | "update")[] } & Omit<
  ProfilerProps,
  "onRender"
>;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) return;

  const queueToSend = [...queue];
  queue = [];

  console.log(queueToSend);
};

setInterval(sendProfileQueue, 5000);

export const Profiler = ({ metadata, phase, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!phase || phase.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
