import Svg from "@/components/svg/base";

export default function TeamIcon(props: React.ComponentProps<"svg">) {
  return (
    <Svg viewBox="0 0 21 16" fill="none" {...props}>
      <path
        d="M17.4784 12.6667C18.1028 12.6667 18.5994 12.2738 19.0454 11.7244C19.9582 10.5996 18.4594 9.70078 17.8878 9.26058C17.3067 8.8131 16.6578 8.5596 16 8.50008M15.1667 6.83341C16.3172 6.83341 17.25 5.90067 17.25 4.75008C17.25 3.59949 16.3172 2.66675 15.1667 2.66675"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.85496 12.6667C2.23055 12.6667 1.73389 12.2738 1.28795 11.7244C0.375074 10.5996 1.87389 9.70078 2.44554 9.26058C3.02665 8.8131 3.67549 8.5596 4.33333 8.50008M4.75 6.83341C3.59941 6.83341 2.66667 5.90067 2.66667 4.75008C2.66667 3.59949 3.59941 2.66675 4.75 2.66675"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.90314 10.2592C6.05166 10.7858 3.81912 11.8608 5.17889 13.2061C5.84312 13.8633 6.5829 14.3333 7.51299 14.3333H12.8203C13.7504 14.3333 14.4902 13.8633 15.1544 13.2061C16.5141 11.8608 14.2816 10.7858 13.4301 10.2592C11.4334 9.02459 8.89985 9.02459 6.90314 10.2592Z"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0833 3.91667C13.0833 5.5275 11.7775 6.83333 10.1666 6.83333C8.55581 6.83333 7.24997 5.5275 7.24997 3.91667C7.24997 2.30584 8.55581 1 10.1666 1C11.7775 1 13.0833 2.30584 13.0833 3.91667Z"
        stroke={props.color}
        strokeWidth="1.5"
      />
    </Svg>
  );
}
