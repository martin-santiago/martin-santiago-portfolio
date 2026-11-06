type DashboardFooterProps = {
  note: string;
};

export function DashboardFooter({ note }: DashboardFooterProps) {
  return (
    <footer className="section-rails px-4 py-10 text-ui sm:px-10">
      <p>
        <span className="text-faint">[*]</span> <span className="font-medium">{note}</span>
      </p>
    </footer>
  );
}
