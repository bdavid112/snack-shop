import { api } from '@api/api'
import { Button } from '@components/Button'

export const ProductsPage = () => {
  return (
    <div className="p-4">
      <h1>Products Page</h1>
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
