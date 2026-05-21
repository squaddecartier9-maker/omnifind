import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY || 'masterKey',
})

export async function searchProducts(query: string, options: {
  category?: string
  storeId?: string
  sortBy?: string
  page?: number
  limit?: number
} = {}) {
  const { category, storeId, sortBy = 'relevance', page = 1, limit = 20 } = options
  const filters: string[] = ['is_active = true']
  if (category) filters.push(`category = "${category}"`)
  if (storeId) filters.push(`store_id = "${storeId}"`)

  const sort = sortBy === 'price_asc' ? ['price:asc']
    : sortBy === 'price_desc' ? ['price:desc']
    : sortBy === 'newest' ? ['created_at:desc']
    : sortBy === 'popular' ? ['sales_count:desc']
    : undefined

  return client.index('products').search(query, {
    filter: filters.join(' AND '),
    sort,
    limit,
    offset: (page - 1) * limit,
    attributesToHighlight: ['name', 'description'],
    highlightPreTag: '<mark class="bg-green-100 text-green-800 rounded px-0.5">',
    highlightPostTag: '</mark>',
  })
}
