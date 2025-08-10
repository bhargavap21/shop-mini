import { useState, useEffect } from 'react'
import { useProductSearch } from '@shopify/shop-minis-react'

interface ComponentSearchModalProps {
  isOpen: boolean
  onClose: () => void
  componentType: 'keycaps' | 'switches' | 'case' | null
  currentConfig: {
    layout: string
    switches: string
    keycaps: string
    case: string
  }
  onProductSelect: (product: any, componentType: 'keycaps' | 'switches' | 'case') => void
  selectedProduct: any | null
}

export function ComponentSearchModal({ isOpen, onClose, componentType, currentConfig, onProductSelect, selectedProduct }: ComponentSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Map component types to search queries (simplified without filters to avoid GraphQL errors)
  const getSearchConfig = (type: string) => {
    switch (type) {
      case 'switches':
        return {
          query: `keyboard switch ${currentConfig.switches}`,
          filters: {}
        }
      case 'keycaps':
        return {
          query: `keycap set ${currentConfig.keycaps}`,
          filters: {}
        }
      case 'case':
        return {
          query: `keyboard case ${currentConfig.case}`,
          filters: {}
        }
      default:
        return { query: 'keyboard', filters: {} }
    }
  }

  const searchConfig = componentType ? getSearchConfig(componentType) : { query: '', filters: {} }
  const effectiveQuery = searchQuery || searchConfig.query

  const { products, loading, error, hasNextPage, fetchMore } = useProductSearch({
    query: effectiveQuery,
    first: 10,
    filters: searchConfig.filters,
  })

  // Reset search when component type changes
  useEffect(() => {
    if (componentType) {
      setSearchQuery('')
    }
  }, [componentType])

  if (!isOpen || !componentType) return null

  const componentLabels = {
    keycaps: 'Keycaps',
    switches: 'Switches', 
    case: 'Case'
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-slate-950 rounded-t-3xl border-t border-slate-700/50 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Shop {componentLabels[componentType]}
            </h2>
            <p className="text-slate-400 text-sm">
              Query Shopify database for → {componentType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for ${componentType} (e.g., "${searchConfig.query}")`}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </div>
          
          {/* Current Selection Info */}
          <div className="mt-4 space-y-3">
            {selectedProduct ? (
              <div className="p-3 bg-green-900/20 rounded-xl border border-green-700/30">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-green-300 font-medium">Selected Product:</span>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedProduct.featuredImage?.url && (
                    <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden">
                      <img 
                        src={selectedProduct.featuredImage.url} 
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{selectedProduct.title}</p>
                    <p className="text-green-400 text-xs">${selectedProduct.priceRange?.minVariantPrice?.amount || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-slate-300">Current selection:</span>
                  <span className="text-white font-medium">
                    {componentType === 'switches' && `${currentConfig.switches} switches`}
                    {componentType === 'keycaps' && `${currentConfig.keycaps} profile keycaps`}
                    {componentType === 'case' && `${currentConfig.case} case`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-300 text-sm">Searching Shopify database...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-400 text-sm mb-2">Search Error</p>
              <p className="text-slate-400 text-xs">{error.message}</p>
            </div>
          )}

          {products && products.length > 0 && (
            <div className="p-6 space-y-4">
              {products.map((product, index) => (
                <div
                  key={product.id || index}
                  className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-900/60 hover:border-slate-600/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                      {product.featuredImage?.url ? (
                        <img 
                          src={product.featuredImage.url} 
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-slate-600 rounded" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm mb-1 truncate">
                        {product.title}
                      </h3>
                      <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      
                      {/* Price and Vendor */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {product.priceRange && (
                            <span className="text-white font-medium text-sm">
                              ${product.priceRange.minVariantPrice?.amount || 'N/A'}
                            </span>
                          )}
                          {product.vendor && (
                            <span className="text-slate-500 text-xs">
                              by {product.vendor}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {selectedProduct?.id === product.id ? (
                            <div className="px-3 py-1.5 bg-green-500/20 border border-green-400/40 text-green-400 text-xs rounded-lg flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Selected</span>
                            </div>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                if (componentType) {
                                  onProductSelect(product, componentType)
                                }
                              }}
                              className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                            >
                              Select
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasNextPage && (
                <button
                  onClick={fetchMore}
                  className="w-full p-3 bg-slate-900/60 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-900/80 hover:text-white transition-all duration-200"
                >
                  Load More Products
                </button>
              )}
            </div>
          )}

          {products && products.length === 0 && !loading && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-700/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-300 text-sm mb-2">No products found</p>
              <p className="text-slate-400 text-xs">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800/50 bg-slate-950/80">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-slate-900/80 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
