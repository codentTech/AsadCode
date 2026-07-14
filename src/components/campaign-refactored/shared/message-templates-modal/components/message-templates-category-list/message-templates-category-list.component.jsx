import { ChevronDown, Edit, FileText, Plus, Trash2 } from "lucide-react";
import { MESSAGE_TEMPLATE_CATEGORY_CONFIG } from "@/common/constants/message-template.constant";
import MessageTemplatesListSkeleton from "../message-templates-list-skeleton.component";
import useMessageTemplatesCategoryList from "./use-message-templates-category-list.hook";

const MessageTemplatesCategoryList = ({
  isOpen,
  templatesByCategory,
  isLoading,
  onSelectTemplate,
  onCreateInCategory,
  onEditTemplate,
  onDeleteTemplate,
}) => {
  const { expandedCategoryIds, toggleCategory } = useMessageTemplatesCategoryList(isOpen);

  if (isLoading) {
    return <MessageTemplatesListSkeleton />;
  }

  return (
    <div className="overflow-visible rounded-lg border border-gray-200">
      {MESSAGE_TEMPLATE_CATEGORY_CONFIG.map((category, index) => {
        const templates = templatesByCategory[category.value] || [];
        const isExpanded = expandedCategoryIds.includes(category.value);
        const Icon = category.icon;

        return (
          <div key={category.value} className={index === 0 ? "" : "border-t border-gray-200"}>
            <button
              type="button"
              onClick={() => toggleCategory(category.value)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
            >
              <Icon className="h-4 w-4 shrink-0 text-gray-700" strokeWidth={1.75} />
              <span className="flex-1 text-sm font-medium text-gray-900">{category.label}</span>
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600">
                {templates.length}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded ? (
              <div className="border-t border-gray-100 bg-gray-50/60 px-3 pb-3 pt-2">
                {templates.length === 0 ? (
                  <p className="px-1 py-2 text-xs text-gray-500">
                    No templates in this category yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="group relative cursor-pointer overflow-visible rounded-md border border-gray-200 bg-white p-3 transition-all hover:border-primary hover:shadow-sm"
                        onClick={() => onSelectTemplate(template)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 shrink-0 text-primary" />
                              <h4 className="truncate text-sm font-medium text-gray-900">
                                {template.name}
                              </h4>
                            </div>
                            <p className="line-clamp-2 text-xs text-gray-600">{template.body}</p>
                          </div>

                          <div className="relative z-10 ml-1 flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTemplate(template);
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-primary transition-colors hover:bg-gray-100"
                              title="Edit template"
                              aria-label="Edit template"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTemplate(template.id);
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-500 transition-colors hover:bg-red-50"
                              title="Delete template"
                              aria-label="Delete template"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onCreateInCategory(category.value)}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/5 sm:text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add new template
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default MessageTemplatesCategoryList;
