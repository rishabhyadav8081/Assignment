export default function EmptyState({ title, text }) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>
  
        <p className="mt-2 text-slate-500">
          {text}
        </p>
      </div>
    );
  }