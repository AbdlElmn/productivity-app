function createIcon(path) {
  return function Icon({ className = "h-4 w-4", strokeWidth = 1.8 }) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };
}

export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>
);

export const OverviewIcon = createIcon(
  <>
    <path d="M4 13h6V4H4z" />
    <path d="M14 20h6v-9h-6z" />
    <path d="M14 10h6V4h-6z" />
    <path d="M4 20h6v-3H4z" />
  </>
);

export const SessionIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2.5" />
  </>
);

export const CategoryIcon = createIcon(
  <>
    <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4H11v7H4Z" />
    <path d="M13 4h3.5A3.5 3.5 0 0 1 20 7.5V11h-7Z" />
    <path d="M4 13h7v7H7.5A3.5 3.5 0 0 1 4 16.5Z" />
    <path d="M13 13h7v3.5a3.5 3.5 0 0 1-3.5 3.5H13Z" />
  </>
);

export const AdminIcon = createIcon(
  <>
    <path d="M12 3 5 6v5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6Z" />
    <path d="m9.75 12 1.5 1.5 3-3.5" />
  </>
);

export const SparklesIcon = createIcon(
  <>
    <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3Z" />
    <path d="m18.5 13 0.8 2.2 2.2 0.8-2.2 0.8-0.8 2.2-0.8-2.2-2.2-0.8 2.2-0.8Z" />
    <path d="m5.5 14 0.8 2.2 2.2 0.8-2.2 0.8-0.8 2.2-0.8-2.2-2.2-0.8 2.2-0.8Z" />
  </>
);

export const ArrowRightIcon = createIcon(<path d="M5 12h14m-4-4 4 4-4 4" />);
export const PlayIcon = createIcon(<path d="m8 6 10 6-10 6z" />);
export const StopIcon = createIcon(<path d="M8 8h8v8H8z" />);
export const PlusIcon = createIcon(<path d="M12 5v14M5 12h14" />);
export const LogOutIcon = createIcon(
  <>
    <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>
);
export const UserIcon = createIcon(
  <>
    <circle cx="12" cy="8" r="3.25" />
    <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
  </>
);
export const LayersIcon = createIcon(
  <>
    <path d="m12 3 9 4.5-9 4.5-9-4.5Z" />
    <path d="m3 12 9 4.5 9-4.5" />
    <path d="m3 16.5 9 4.5 9-4.5" />
  </>
);
export const CheckCircleIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="8" />
    <path d="m9 12 2 2 4-4" />
  </>
);
