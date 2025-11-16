import ProductManager from '@/components/product-manager'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shopping App</h1>
          <p className="text-muted-foreground">Manage your products with full CRUD operations</p>
        </div>
        <ProductManager />
      </div>
    </main>
  )
}
