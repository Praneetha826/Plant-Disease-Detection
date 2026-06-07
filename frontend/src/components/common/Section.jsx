export function Section({ id, children, className = "" }) {
  return (
    <div className={`legacy-container ${className}`} id={id}>
      <section className="legacy-section">
        <div className="content">
          <div className="info">{children}</div>
        </div>
      </section>
    </div>
  );
}
