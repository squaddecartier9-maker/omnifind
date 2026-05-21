const { MeiliSearch } = require('meilisearch');
const { query } = require('../db/client');

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_KEY || 'masterKey',
});

const INDEX = 'products';

async function initSearch() {
  const index = client.index(INDEX);
  await index.updateSettings({
    searchableAttributes: ['name', 'description', 'category', 'tags', 'store_name'],
    filterableAttributes: ['category', 'store_id', 'is_active', 'currency'],
    sortableAttributes: ['price', 'created_at', 'sales_count', 'views'],
    rankingRules: ['words','typo','proximity','attribute','sort','exactness','sales_count:desc'],
  });
  console.log('Meilisearch index configured');
}

async function indexProduct(product) {
  const index = client.index(INDEX);
  await index.addDocuments([{
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    tags: product.tags || [],
    store_id: product.store_id,
    store_name: product.store_name,
    store_slug: product.store_slug,
    images: product.images,
    is_active: product.is_active,
    sales_count: product.sales_count,
    currency: product.currency,
    created_at: product.created_at,
  }]);
}

async function removeProduct(productId) {
  await client.index(INDEX).deleteDocument(productId);
}

async function search(q, { category, storeId, sortBy = 'relevance', page = 1, limit = 20 } = {}) {
  const filters = ['is_active = true'];
  if (category) filters.push(`category = "${category}"`);
  if (storeId) filters.push(`store_id = "${storeId}"`);

  const sort = sortBy === 'price_asc' ? ['price:asc']
    : sortBy === 'price_desc' ? ['price:desc']
    : sortBy === 'newest' ? ['created_at:desc']
    : sortBy === 'popular' ? ['sales_count:desc']
    : undefined;

  const result = await client.index(INDEX).search(q, {
    filter: filters.join(' AND '),
    sort,
    limit,
    offset: (page - 1) * limit,
    attributesToHighlight: ['name', 'description'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
  });

  return {
    hits: result.hits,
    total: result.estimatedTotalHits,
    page,
    pages: Math.ceil(result.estimatedTotalHits / limit),
    processingTime: result.processingTimeMs,
  };
}

module.exports = { initSearch, indexProduct, removeProduct, search };
