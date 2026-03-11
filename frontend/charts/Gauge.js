import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Gauge({ value = 0, label = "Score" }) {
  const score = Math.max(0, Math.min(100, Number(value || 0)));
  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ["#22d3ee", "rgba(148,163,184,0.2)"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="relative mx-auto h-56 w-56">
      <Doughnut
        data={data}
        options={{
          cutout: "76%",
          plugins: { legend: { display: false } },
          rotation: -90,
          circumference: 180,
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
        <p className="text-3xl font-semibold text-cyan-200">{score.toFixed(0)}%</p>
        <p className="text-xs text-slate-300">{label}</p>
      </div>
    </div>
  );
}

