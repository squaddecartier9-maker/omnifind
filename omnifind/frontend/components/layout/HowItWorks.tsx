export function HowItWorks() {
  const steps = [
    {n:'01',title:'Search once',body:'Type what you want. OmniFind searches every partner store simultaneously across Europe and beyond.'},
    {n:'02',title:'Compare instantly',body:'Price, delivery, stock and reviews all on one screen. No tabs, no jumping between sites.'},
    {n:'03',title:'Buy in one click',body:'One cart, one payment. We handle the rest so you can get back to living your life.'},
  ]
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <p className="text-xs font-medium text-green-600 uppercase tracking-widest mb-2">How it works</p>
      <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">Simpler than anything.</h2>
      <p className="text-gray-500 mb-10">No tutorials. No config hell. You are live in under 10 minutes.</p>
      <div className="grid grid-cols-3 gap-4">
        {steps.map(s => (
          <div key={s.n} className="bg-gray-50 border border-gray-100 rounded-xl p-6">
            <div className="text-3xl font-medium text-green-600 mb-4">{s.n}</div>
            <div className="font-medium text-gray-900 mb-2">{s.title}</div>
            <div className="text-sm text-gray-500 leading-relaxed">{s.body}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
