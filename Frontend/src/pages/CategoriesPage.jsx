import { useEffect, useState } from "react";
import { CategoryIcon, PlusIcon } from "../components/icons";
import Button from "../components/ui/Button";
import { Card, CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { Field, Input } from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import { PageSkeleton } from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatShortDate } from "../lib/format";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [draft, setDraft] = useState({ name: "", color: "#22C55E" });
  const [editingId, setEditingId] = useState(null);
  const [editingDraft, setEditingDraft] = useState({ name: "", color: "#22C55E" });
  const [status, setStatus] = useState({ loading: true, saving: false, error: "" });

  const loadCategories = async () => {
    try {
      setStatus((current) => ({ ...current, loading: true, error: "" }));
      const data = await apiRequest("/categories", { token });
      setCategories(data);
    } catch (loadError) {
      setStatus((current) => ({ ...current, error: loadError.message }));
    } finally {
      setStatus((current) => ({ ...current, loading: false }));
    }
  };

  useEffect(() => {
    loadCategories();
  }, [token]);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setStatus((current) => ({ ...current, saving: true, error: "" }));
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: draft,
      });
      setDraft({ name: "", color: "#22C55E" });
      await loadCategories();
    } catch (submitError) {
      setStatus((current) => ({ ...current, error: submitError.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingDraft({ name: category.name, color: category.color || "#22C55E" });
  };

  const handleUpdate = async (categoryId) => {
    try {
      setStatus((current) => ({ ...current, saving: true, error: "" }));
      await apiRequest(`/categories/${categoryId}`, {
        method: "PUT",
        token,
        body: editingDraft,
      });
      setEditingId(null);
      await loadCategories();
    } catch (submitError) {
      setStatus((current) => ({ ...current, error: submitError.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  };

  const handleDelete = async (categoryId) => {
    if (
      !window.confirm(
        "Delete this category? Sessions will stay, but the category link will be removed."
      )
    ) {
      return;
    }

    try {
      setStatus((current) => ({ ...current, saving: true, error: "" }));
      await apiRequest(`/categories/${categoryId}`, {
        method: "DELETE",
        token,
      });
      await loadCategories();
    } catch (submitError) {
      setStatus((current) => ({ ...current, error: submitError.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  };

  if (status.loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Categories"
        title="Organize your work into clear lanes"
        description="Keep the list small, memorable, and useful enough to make the dashboard easy to read."
      />

      {status.error ? (
        <Card className="border border-rose-300/10 bg-rose-400/8">
          <p className="text-sm text-rose-200">{status.error}</p>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader
            eyebrow="Create"
            title="Add a new category"
            description="Use a short, durable name and a color that helps the dashboard scan well."
          />

          <form className="space-y-5" onSubmit={handleCreate}>
            <Field label="Name">
              <Input
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Study, Work, Reading..."
                required
              />
            </Field>

            <Field label="Color">
              <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
                <input
                  className="h-11 w-11 rounded-xl border-0 bg-transparent"
                  type="color"
                  value={draft.color}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      color: event.target.value.toUpperCase(),
                    }))
                  }
                />
                <div>
                  <p className="text-sm font-medium text-white">{draft.color}</p>
                  <p className="text-sm text-slate-500">
                    Used for charts, pills, and quick scanning.
                  </p>
                </div>
              </div>
            </Field>

            <Button type="submit" disabled={status.saving}>
              <PlusIcon className="h-4 w-4" />
              {status.saving ? "Saving..." : "Create category"}
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader
            eyebrow="Collection"
            title="Your categories"
            description="Edit, rename, or remove categories as your workflow changes."
            action={<StatusBadge tone="neutral">{categories.length} total</StatusBadge>}
          />

          {categories.length === 0 ? (
            <EmptyState
              icon={<CategoryIcon className="h-5 w-5" />}
              title="No categories yet"
              description="Create one to group your sessions and keep the analytics readable."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/8"
                >
                  {editingId === category.id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingDraft.name}
                        onChange={(event) =>
                          setEditingDraft((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-3">
                        <input
                          className="h-11 w-11 rounded-xl border-0 bg-transparent"
                          type="color"
                          value={editingDraft.color}
                          onChange={(event) =>
                            setEditingDraft((current) => ({
                              ...current,
                              color: event.target.value.toUpperCase(),
                            }))
                          }
                        />
                        <span className="text-sm text-slate-400">{editingDraft.color}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => handleUpdate(category.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-1 h-4 w-4 rounded-full ring-4 ring-white/5"
                          style={{ backgroundColor: category.color || "#64748B" }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">{category.name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {category.color || "No color"} - Created{" "}
                            {category.createdAt
                              ? formatShortDate(category.createdAt)
                              : "recently"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => startEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
