export function PricingSection() {
  const plans = [
    {name:'Starter',price:'€0',per:'free forever',features:['1 store','100 products','Universal search','0% transaction fees'],featured:false},
    {name:'Growth',price:'€19',per:'per month',features:['5 stores','Unlimited products','Advanced analytics','Referral system','Priority support'],featured:true},
    {name:'Enterprise',price:'€59',per:'per month',features:['Unlimited stores','API access','White-label option','Dedicated manager','Custom integrations'],featured:false},
  ]
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <p className="text-xs font-medium text-green-600 uppercase tracking-widest mb-2">Pricing</p>
      <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">Start free. Stay free.</h2>
      <p className="text-gray-500 mb-10">No credit card. No transaction fees. Ever.</p>
      <div className="grid grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.name} className={\`rounded-xl p-6 border \${p.featured ? 'border-green-500 border-2' : 'border-gray-200'}\`}>
            {p.featured && <div className="inline-block bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full mb-3 font-medium">Most popular</div>}
            <div className="text-sm text-gray-500 mb-1">{p.name}</div>
            <div className="text-4xl font-medium text-gray-900 tracking-tight">{p.price}</div>
            <div className="text-xs text-gray-400 mb-5">{p.per}</div>
            {p.features.map(f => <div key={f} className="flex items-center gap-2 text-sm text-gray-600 py-1.5 border-t border-gray-50"><span className="text-green-500">checkmark</span> {f}</div>)}
          </div>
        ))}
      </div>
    </section>
  )
}
