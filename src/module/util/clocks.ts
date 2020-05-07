export const getSegmentPaths = ({
  segments,
  size,
}: {
  segments: number;
  size: number;
}) => {
  const segmentSizes = 360 / segments;
  const radius = size / 2;
  const pathTransforms = Array(segments)
    .fill(undefined)
    .map((_, idx) => {
      const position =
        idx * segmentSizes - (segments % 2 !== 0 ? 0.5 * segmentSizes : 0);
      const rad = position * (Math.PI / 180);
      const arr = [
        Math.cos(rad) * radius + size / 2,
        Math.sin(rad) * radius + size / 2,
      ];
      return arr;
    });
  return pathTransforms;
};

export const generateClockTemplatePayload = ({
  id,
  segments,
  size,
  ticks,
  title,
  edit,
}: {
  segments: number;
  size: number;
  id: number;
  ticks: number;
  title: string;
  edit: boolean;
}) => {
  const pathTransforms = getSegmentPaths({ segments, size });
  const data = {
    segments,
    ticks,
    percent: (ticks / segments) * 100,
    pathTransforms,
    size,
    id,
    title,
    edit,
  };
  return data;
};
