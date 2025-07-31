import { api } from '@api/api'
import { Button } from '@components/Button'
import { ProductCard } from '@components/Card/ProductCard'

import img from '@assets/pringles_sour_cream_onion.jpeg'

export const ProductsPage = () => {
  return (
    <div className="p-4">
      <h3 className="text-[var(--zui-text-inverted)]">Snacks</h3>
      <ProductCard
        product={{
          id: 15,
          name: 'Pringles Sour Cream 165 g',
          description: 'Crispy potato chips with a tangy sour cream flavor.',
          price: 276,
          stock: 17,
          image_url: img,
        }}
      />
      <Button
        variant="ghost"
        onClick={() => {
          api
            .post('/logout')
            .then(() => {
              console.log('Logged out successfully')
            })
            .catch((err) => {
              console.error('Logout failed:', err)
            })
            .finally(() => {
              window.location.href = '/login'
            })
        }}
      >
        Log out
      </Button>
    </div>
  )
}

export default ProductsPage
