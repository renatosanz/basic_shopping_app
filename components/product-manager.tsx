'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface Product {
  id: string
  name: string
  price: number
  description: string
  stock: number
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: ''
  })
  const { toast } = useToast()

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('products')
    if (stored) {
      setProducts(JSON.parse(stored))
    }
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0 || localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(products))
    }
  }, [products])

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', stock: '' })
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleCreate = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      stock: parseInt(formData.stock)
    }

    setProducts([...products, newProduct])
    toast({
      title: 'Success',
      description: 'Product created successfully'
    })
    resetForm()
  }

  const handleUpdate = () => {
    if (!editingId) return

    const updatedProducts = products.map(product =>
      product.id === editingId
        ? {
            ...product,
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            stock: parseInt(formData.stock)
          }
        : product
    )

    setProducts(updatedProducts)
    toast({
      title: 'Success',
      description: 'Product updated successfully'
    })
    resetForm()
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      stock: product.stock.toString()
    })
    setEditingId(product.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
    toast({
      title: 'Success',
      description: 'Product deleted successfully'
    })
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Create/Edit Form */}
      {isFormOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the product details' : 'Fill in the details to create a new product'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Wireless Headphones"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleCreate} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingId ? 'Update' : 'Create'} Product
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      )}

      {/* Products List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">No products yet. Create your first product to get started!</p>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-balance">{product.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <p className="text-sm text-muted-foreground text-pretty">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Stock: <span className="font-medium text-foreground">{product.stock}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
