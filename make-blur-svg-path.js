//
function circleBlur() {
  return (
    <svg width="500px" height="200px">
      <defs>
        <filter id="blur">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <circle
        filter="url(#blur)"
        cx="100"
        cy="100"
        r="50"
        fill="green"
      ></circle>
      <circle cx="220" cy="100" r="50" fill="red"></circle>
    </svg>
  );
}
