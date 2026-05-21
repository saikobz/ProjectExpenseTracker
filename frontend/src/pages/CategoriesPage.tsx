import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeaderButton } from '@/components/common/PageHeaderButton'
import { TabbedPageChrome } from '@/components/common/TabbedPageChrome'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryListPanel } from '@/features/categories/components/CategoryListPanel'
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

  const expenseCount = expenseQuery.data?.length ?? 0
  const incomeCount = incomeQuery.data?.length ?? 0

  const subtitle = useMemo(() => {
    const total = expenseCount + incomeCount
    if (total === 0) return 'Create categories to label income and expenses.'
    return `${total} categories · ${expenseCount} expense · ${incomeCount} income`
  }, [expenseCount, incomeCount])

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
    <>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as CategoryType)}
        className="w-full"
      >
        <TabbedPageChrome
          title="Categories"
          subtitle={subtitle}
          tabs={
            <TabsList variant="segmented">
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          }
          controls={
            <PageHeaderButton className="w-full" onClick={openCreate}>
              <Plus className="size-4" />
              Add category
            </PageHeaderButton>
          }
        >
          <TabsContent value="expense" className="mt-0">
            <CategoryListPanel
              type="expense"
              categories={expenseQuery.data ?? []}
              isLoading={expenseQuery.isLoading}
              isError={expenseQuery.isError}
              onRetry={() => void expenseQuery.refetch()}
              onEdit={openEdit}
              onDelete={setDeletingCategory}
              onAdd={openCreate}
            />
          </TabsContent>

          <TabsContent value="income" className="mt-0">
            <CategoryListPanel
              type="income"
              categories={incomeQuery.data ?? []}
              isLoading={incomeQuery.isLoading}
              isError={incomeQuery.isError}
              onRetry={() => void incomeQuery.refetch()}
              onEdit={openEdit}
              onDelete={setDeletingCategory}
              onAdd={openCreate}
            />
          </TabsContent>
        </TabbedPageChrome>
      </Tabs>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingCategory(null)
        }}
      >
        <DialogContent className="max-w-md">
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

      <ConfirmDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null)
        }}
        title="Delete category?"
        description={
          <>
            This will permanently delete &quot;{deletingCategory?.name}&quot;. Categories
            with transactions cannot be deleted.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </>
  )
}
