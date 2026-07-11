import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/provider/features/message-templates/message-templates.slice";

const useMessageTemplatesModal = (isOpen, onSelectTemplate, creatorName) => {
  const dispatch = useDispatch();
  const { templates, getAllTemplates: getAllTemplatesState } = useSelector(
    (state) => state.messageTemplates
  );

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ name: "", body: "" });
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const prevCreatingRef = useRef(false);
  const prevUpdatingRef = useRef(false);

  const isLoading = getAllTemplatesState.isLoading;
  const isCreating = useSelector((state) => state.messageTemplates.createTemplate.isLoading);
  const isUpdating = useSelector((state) => state.messageTemplates.updateTemplate.isLoading);
  const isDeleting = useSelector((state) => state.messageTemplates.deleteTemplate.isLoading);
  const createSuccess = useSelector((state) => state.messageTemplates.createTemplate.isSuccess);
  const updateSuccess = useSelector((state) => state.messageTemplates.updateTemplate.isSuccess);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllTemplates());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "" });
      setDeleteTemplateId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (prevCreatingRef.current && !isCreating && createSuccess) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "" });
    }
    prevCreatingRef.current = isCreating;
  }, [isCreating, createSuccess]);

  useEffect(() => {
    if (prevUpdatingRef.current && !isUpdating && updateSuccess) {
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({ name: "", body: "" });
    }
    prevUpdatingRef.current = isUpdating;
  }, [isUpdating, updateSuccess]);

  const handleCreate = useCallback(() => {
    setShowForm(true);
    setEditingTemplate(null);
    setFormData({ name: "", body: "" });
  }, []);

  const handleEdit = useCallback((template) => {
    setEditingTemplate(template);
    setFormData({ name: template.name, body: template.body });
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

    if (editingTemplate) {
      dispatch(
        updateTemplate({
          templateId: editingTemplate.id,
          templateData: { name: formData.name.trim(), body: formData.body.trim() },
        })
      );
    } else {
      dispatch(createTemplate({ name: formData.name.trim(), body: formData.body.trim() }));
    }
  }, [formData, editingTemplate, dispatch]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: "", body: "" });
  }, []);

  const handleSelectTemplate = useCallback(
    (template) => {
      const greeting = `Hey ${creatorName || "{{creator_name}}"},`;
      const fullMessage = `${greeting} ${template.body}`;
      onSelectTemplate(fullMessage);
    },
    [creatorName, onSelectTemplate]
  );

  return {
    templates,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showForm,
    editingTemplate,
    formData,
    setFormData,
    deleteTemplateId,
    handleCreate,
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
