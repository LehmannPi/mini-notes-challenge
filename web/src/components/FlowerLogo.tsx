// React import not required for JSX in React 17+/Vite, removing to satisfy linter

type Props = {
  size?: number;
  className?: string;
};

export function FlowerLogo({ size = 48, className }: Props) {
  const dim = size;
  return (
    <svg
      className={`flower-logo drop-shadow-lg transition-transform hover:scale-105 origin-center animate-logo-pop ${
        className || ''
      }`}
      width={dim}
      height={dim}
      viewBox="0 0 233 232"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <g id="Repeat_group_1_inner">
          <path
            d="M114.659 12.1641C131.744 25.4797 140.078 47.3184 139.751 70.7286C139.428 93.8084 130.651 117.607 114.464 134.704C97.1383 108.04 91.4556 85.0311 92.86 65.046C94.2419 45.3814 102.535 27.9286 114.659 12.1641Z"
            fill="#C1D9C3"
            stroke="white"
            strokeWidth="12"
          />
        </g>
      </defs>

      <g className="petal origin-center animate-petal-appear">
        <use xlinkHref="#Repeat_group_1_inner" />
      </g>
      <g className="petal origin-center animate-petal-appear">
        <use
          xlinkHref="#Repeat_group_1_inner"
          transform="translate(158.231 -42.3979) rotate(60)"
        />
      </g>
      <g className="petal origin-center animate-petal-appear">
        <use
          xlinkHref="#Repeat_group_1_inner"
          transform="translate(274.064 73.4353) rotate(120)"
        />
      </g>
      <g className="petal origin-center animate-petal-appear">
        <use
          xlinkHref="#Repeat_group_1_inner"
          transform="translate(231.666 231.666) rotate(-180)"
        />
      </g>
      <g className="petal origin-center animate-petal-appear">
        <use
          xlinkHref="#Repeat_group_1_inner"
          transform="translate(73.4353 274.064) rotate(-120)"
        />
      </g>
      <g className="petal origin-center animate-petal-appear">
        <use
          xlinkHref="#Repeat_group_1_inner"
          transform="translate(-42.3979 158.231) rotate(-60)"
        />
      </g>
    </svg>
  );
}

export default FlowerLogo;
