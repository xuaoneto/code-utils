export function AnimateTransition(
  animateValues: number[],
  duration: number = 200,
  stepAction: (progress: number) => void,
  onFinish?: () => void
) {
  let start: number | null;
  let numberOfSteps = animateValues.length - 1;
  let timePerStep = duration / animateValues.length;
  let i = 0;
  if (animateValues.length < 2)
    return console.error(
      new Error("AnimateTransition requires at least two transition values")
    );

  function animate(time: number) {
    if (start == null) start = time;
    const progressStep = (time - start) / timePerStep;
    if (progressStep <= 1) {
      const progressive = animateValues[i + 1] > animateValues[i];
      const to = animateValues[i + 1] - animateValues[i];
      const currValue = Math.min(
        to * progressStep + animateValues[i],
        animateValues[progressive ? i + 1 : i]
      );
      stepAction(currValue);
      requestAnimationFrame(animate);
    } else {
      if (i < numberOfSteps) {
        i++;
        start = null;
        requestAnimationFrame(animate);
      } else onFinish?.();
    }
  }
  requestAnimationFrame(animate);
}
