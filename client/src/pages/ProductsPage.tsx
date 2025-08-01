import { api } from '@api/api'
import { ProductCard } from '@components/Card/ProductCard'
import { ProductTable } from '@components/Table/ProductTable'
import { ProductResponse } from '@shared/schemas/product'
import { EntityList } from '@components/EntityList'

export const ProductsPage = () => {
  return (
    <EntityList<ProductResponse>
      title="Snacks"
      fetchEntities={() =>
        api.get<ProductResponse[]>('/products', { withCredentials: true }).then((res) => res.data)
      }
      renderGridItem={(product) => <ProductCard key={product.id} product={product} />}
      renderListView={(products, selectedIds, toggleOne, toggleAll, refresh) => (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          refreshProducts={refresh}
        />
      )}
      defaultView="grid"
      allowToggle={true}
    />
  )
}

export default ProductsPage
