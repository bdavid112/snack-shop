import { api } from '@api/api'
import { Button } from '@components/Button'
import { ProductCard } from '@components/Card/ProductCard'

import img from '@assets/pringles_sour_cream_onion.jpeg'
import { Tabs } from '@components/Tabs'
import { Tab } from '@components/Tab'

import { HiViewGrid, HiViewList } from 'react-icons/hi'
import { useState } from 'react'

const products = [
  {
    id: 15,
    name: 'Pringles Sour Cream 165 g',
    description: 'Crispy potato chips with a tangy sour cream flavor.',
    price: 276,
    stock: 17,
    discount: 50,
    image_url: img,
  },
]

export const ProductsPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="">
      <div className="flex justify-between">
        <h3 className="text-[var(--zui-text-inverted)]">Snacks</h3>
        <Tabs variant="elevated">
          <Tab onClick={() => setView('grid')} variant="elevated">
            <HiViewGrid className="text-lg" />
          </Tab>
          <Tab onClick={() => setView('list')} variant="elevated">
            <HiViewList className="text-lg" />
          </Tab>
        </Tabs>
      </div>
      {/* Conditional Layout Rendering */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4"></div>
      )}
      <Button
        variant="ghost"
        onClick={() => {
          api
            .post('/logout')
            .then(() => console.log('Logged out'))
            .catch((err) => console.error('Logout failed:', err))
            .finally(() => (window.location.href = '/login'))
        }}
      >
        Log out
      </Button>
    </div>
  )
}

export default ProductsPage
