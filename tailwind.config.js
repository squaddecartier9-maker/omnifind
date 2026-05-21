export function GrowthSection() {
  const items = [
    {icon:'link',title:'Your own store URL',desc:'omnifind.io/yourstore — one link to share on TikTok, Instagram, or anywhere.'},
    {icon:'users',title:'Built-in referral system',desc:'Buyers earn discounts when they bring friends. Viral growth by design.'},
    {icon:'trending',title:'Live product rankings',desc:'A public real-time leaderboard. Sellers compete for organic traffic for everyone.'},
    {icon:'bolt',title:'Free embed widget',desc:'One line of code adds Also on OmniFind to any existing site.'},
  ]
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <p className="text-xs font-medium text-green-600 uppercase tracking-widest mb-2">Growth engine</p>
      <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">It spreads itself.</h2>
      <p className="text-gray-500 mb-10">Every feature is built to bring you more buyers without spending on ads.</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map(i => (
          <div key={i.title} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <div className="font-medium text-gray-900 mb-1">{i.title}</div>
            <div className="text-sm text-gray-500 leading-relaxed">{i.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
