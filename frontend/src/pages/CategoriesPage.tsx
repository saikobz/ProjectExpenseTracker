import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CategoryForm,
  type CategoryFormValues,
} from '@/features/categories/components/CategoryForm'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/categories/hooks/useCategories'
import { getCategoryErrorMessage } from '@/services/category.service'
import type { Category, CategoryType } from '@/types/category'

function CategoryList({
  categories,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: {
  categories: Category[]
  isLoading: boolean
  isError: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading categories...</p>
  }

  if (isError) {
    return (
      <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
        Failed to load categories. Please try again.
      </p>
    )
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No categories yet. Add your first category to get started.
      </p>
    )
  }

  return (
    <ul className="divide-y rounded-lg border">
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: category.color ?? '#6B7280' }}
            />
            <span className="truncate font-medium">{category.name}</span>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<CategoryType>('expense')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const expenseQuery = useCategories('expense')
  const incomeQuery = useCategories('income')
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const openCreate = () => {
    setEditingCategory(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setFormError(null)
    setFormOpen(true)
  }

  const handleFormSubmit = async (values: CategoryFormValues) => {
    setFormError(null)
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          input: { name: values.name, color: values.color ?? null },
        })
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          type: values.type,
          color: values.color ?? null,
        })
      }
      setFormOpen(false)
      setEditingCategory(null)
    } catch (err) {
      setFormError(getCategoryErrorMessage(err))
    }
  }

  const handleDelete = async () => {
    if (!deletingCategory) return
    try {
      await deleteMutation.mutateAsync(deletingCategory.id)
      setDeletingCategory(null)
    } catch (err) {
      setFormError(getCategoryErrorMessage(err))
      setDeletingCategory(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage income and expense categories for your transactions.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add category
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as CategoryType)}
      >
        <TabsList>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense categories</CardTitle>
              <CardDescription>Track where your money goes.</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryList
                categories={expenseQuery.data ?? []}
                isLoading={expenseQuery.isLoading}
                isError={expenseQuery.isError}
                onEdit={openEdit}
                onDelete={setDeletingCategory}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Income categories</CardTitle>
              <CardDescription>Track where your money comes from.</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryList
                categories={incomeQuery.data ?? []}
                isLoading={incomeQuery.isLoading}
                isError={incomeQuery.isError}
                onEdit={openEdit}
                onDelete={setDeletingCategory}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingCategory(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit category' : 'Add category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category name or color.'
                : 'Create a new category for your transactions.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            defaultType={activeTab}
            category={editingCategory ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormOpen(false)
              setEditingCategory(null)
            }}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            error={formError}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletingCategory?.name}&quot;. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => void handleDelete()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
