import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/provider/features/message-templates/message-templates.slice";
import { DEFAULT_MESSAGE_TEMPLATE_CATEGORY } from "@/common/constants/message-template.constant";
import {
  buildTemplateMessage,
  groupTemplatesByCategory,
  normalizeTemplateCategory,
} from "@/common/utils/message-template.util";

const useMessageTemplatesModal = (isOpen, onSelectTemplate, creatorName) => {
  const dispatch = useDispatch();
  const { templates, getAllTemplates: getAllTemplatesState } = useSelector(
    (state) => state.messageTemplates
  );

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    body: "",
    category: DEFAULT_MESSAGE_TEMPLATE_CATEGORY,
  });
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const prevCreatingRef = useRef(false);
  const prevUpdatingRef = useRef(false);

  const isLoading = getAllTemplatesState.isLoading;
  const isCreating = useSelector((state) => state.messageTemplates.createTemplate.isLoading);
  const isUpdating = useSelector((state) => state.messageTemplates.updateTemplate.isLoading);
  const isDeleting = useSelector((state) => state.messageTemplates.deleteTemplate.isLoading);
  const createSuccess = useSelector((state) => state.messageTemplates.createTemplate.isSuccess);
  const updateSuccess = useSelector((state) => state.messageTemplates.updateTemplate.isSuccess);

  const templatesByCategory = useMemo(() => groupTemplatesByCategory(templates), [templates]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllTemplates());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "", category: DEFAULT_MESSAGE_TEMPLATE_CATEGORY });
      setDeleteTemplateId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (prevCreatingRef.current && !isCreating && createSuccess) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "", category: DEFAULT_MESSAGE_TEMPLATE_CATEGORY });
    }
    prevCreatingRef.current = isCreating;
  }, [isCreating, createSuccess]);

  useEffect(() => {
    if (prevUpdatingRef.current && !isUpdating && updateSuccess) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "", category: DEFAULT_MESSAGE_TEMPLATE_CATEGORY });
    }
    prevUpdatingRef.current = isUpdating;
  }, [isUpdating, updateSuccess]);

  const handleCreateInCategory = useCallback((category) => {
    setShowForm(true);
    setEditingTemplate(null);
    setFormData({
      name: "",
      body: "",
      category: normalizeTemplateCategory(category),
    });
  }, []);

  const handleEdit = useCallback((template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      body: template.body,
      category: normalizeTemplateCategory(template.category),
    });
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((templateId) => {
    setDeleteTemplateId(templateId);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteTemplateId(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTemplateId) {
      dispatch(deleteTemplate(deleteTemplateId));
      setDeleteTemplateId(null);
    }
  }, [deleteTemplateId, dispatch]);

  const handleSubmit = useCallback(() => {
    if (!formData.name.trim() || !formData.body.trim()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      body: formData.body.trim(),
      category: normalizeTemplateCategory(formData.category),
    };

    if (editingTemplate) {
      dispatch(
        updateTemplate({
          templateId: editingTemplate.id,
          templateData: payload,
        })
      );
      return;
    }

    dispatch(createTemplate(payload));
  }, [formData, editingTemplate, dispatch]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: "", body: "", category: DEFAULT_MESSAGE_TEMPLATE_CATEGORY });
  }, []);

  const handleSelectTemplate = useCallback(
    (template) => {
      onSelectTemplate(buildTemplateMessage(template, creatorName));
    },
    [creatorName, onSelectTemplate]
  );

  return {
    templatesByCategory,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showForm,
    editingTemplate,
    formData,
    setFormData,
    deleteTemplateId,
    handleCreateInCategory,
    handleEdit,
    handleDeleteClick,
    handleCancelDelete,
    handleConfirmDelete,
    handleSubmit,
    handleCancel,
    handleSelectTemplate,
  };
};

export default useMessageTemplatesModal;
