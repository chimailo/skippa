import Svg from "@/components/svg/base";

export default function UserIcon(props: React.ComponentProps<"svg">) {
  return (
    <Svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.44444 3.55556C4.44444 2.61256 4.81905 1.70819 5.48584 1.0414C6.15264 0.374602 7.05701 0 8 0C8.94299 0 9.84736 0.374602 10.5142 1.0414C11.181 1.70819 11.5556 2.61256 11.5556 3.55556C11.5556 4.49855 11.181 5.40292 10.5142 6.06971C9.84736 6.73651 8.94299 7.11111 8 7.11111C7.05701 7.11111 6.15264 6.73651 5.48584 6.06971C4.81905 5.40292 4.44444 4.49855 4.44444 3.55556ZM4.44444 8.88889C3.2657 8.88889 2.13524 9.35714 1.30175 10.1906C0.468253 11.0241 0 12.1546 0 13.3333C0 14.0406 0.280952 14.7189 0.781049 15.219C1.28115 15.7191 1.95942 16 2.66667 16H13.3333C14.0406 16 14.7189 15.7191 15.219 15.219C15.7191 14.7189 16 14.0406 16 13.3333C16 12.1546 15.5317 11.0241 14.6983 10.1906C13.8648 9.35714 12.7343 8.88889 11.5556 8.88889H4.44444Z"
      />
    </Svg>
  );
}
