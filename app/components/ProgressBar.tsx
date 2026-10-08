interface Props {
  total: number;
  completed: number;
}

export default function ProgressBar({
  total,
  completed,
}: Props) {
  const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const ready = total > 0 && completed === total;

  return (
    <div className={`meter${ready ? " ready" : ""}`} aria-live="polite">
      <div className="stamp">READY!</div>

      <h2>준비 진행률</h2>

      <p className="note">
        전체 {total}개 중 {completed}개 완료
      </p>

      <div className="bar">
        <i style={{ width: `${progress}%` }} />
      </div>

      <div className="count">
        <b>{progress}</b>
        <span>%</span>
      </div>
    </div>
  );
}
