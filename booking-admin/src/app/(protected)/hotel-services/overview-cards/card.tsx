
import type { JSX, SVGProps } from "react";

type PropsType = {
  label: string;
  data: {
    value: number | string;
    // date: number;
  };
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export function OverviewCard({ label, data, Icon }: PropsType) {
  // const isDecreasing = data.date < 7;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      {Icon && <Icon className="h-6 w-6" />}

      <div className="mt-6 flex items-end justify-between">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {data.value}
          </dt>

          <dd className="text-lg font-medium text-dark-6">{label}</dd>
        </dl>
      </div>
    </div>
  );
}
