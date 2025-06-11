import { useState } from "react";
import useCommonHelpers from "@/common/hooks/use-common-helper.hook";

const useDeliverablesProgress = () => {
  const { getStatusColor, getStatusIcon } = useCommonHelpers();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [project, setProject] = useState({
    title: "Brand Identity Design Package",
    client: "TechStart Inc.",
    totalAmount: 2500,
    timeline: [
      { id: 1, step: "Contract Signed", completed: true, date: "2024-05-15" },
      { id: 2, step: "Submit Content", completed: true, date: "2024-05-20" },
      { id: 3, step: "Content Approved", completed: false, date: "2024-05-25" },
      { id: 4, step: "Payment Released", completed: false, date: "2024-05-30" },
    ],
    deliverables: [
      {
        id: 1,
        title: "Logo Design (3 concepts)",
        deadline: "2024-06-01",
        amount: 800,
        status: "completed",
        completed: true,
      },
      {
        id: 2,
        title: "Brand Guidelines Document",
        deadline: "2024-06-05",
        amount: 600,
        status: "in-progress",
        completed: false,
      },
      {
        id: 3,
        title: "Business Card Design",
        deadline: "2024-06-08",
        amount: 400,
        status: "pending",
        completed: false,
      },
      {
        id: 4,
        title: "Social Media Templates",
        deadline: "2024-06-10",
        amount: 700,
        status: "pending",
        completed: false,
      },
    ],
  });

  const privateNotes = [
    {
      text: "Mention the brand in the first 5 seconds",
      timestamp: "2025-04-23 10:12 AM",
    },
    { text: "Use trending audio", timestamp: "2025-04-23 10:15 AM" },
    {
      text: "Tag the brand and use hashtag #SpringLaunch",
      timestamp: "2025-04-23 10:18 AM",
    },
  ];

  const handleEdit = (type, item) => {
    setEditingItem({ type, id: item.id });
    if (type === "deliverable") {
      setEditForm({
        title: item.title,
        deadline: item.deadline,
        amount: item.amount,
      });
    }
  };

  const handleSave = () => {
    if (editingItem.type === "deliverable") {
      setProject((prev) => ({
        ...prev,
        deliverables: prev.deliverables.map((item) =>
          item.id === editingItem.id ? { ...item, ...editForm } : item
        ),
      }));
    }
    setEditingItem(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const toggleDeliverable = (id) => {
    setProject((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              status: !item.completed ? "completed" : "pending",
            }
          : item
      ),
    }));
  };

  const toggleTimelineStep = (id) => {
    setProject((prev) => ({
      ...prev,
      timeline: prev.timeline.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      ),
    }));
  };

  return {
    getStatusColor,
    getStatusIcon,
    project,
    privateNotes,
    editingItem,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleDeliverable,
    toggleTimelineStep,
    messageDialogOpen,
    setMessageDialogOpen,
  };
};

export default useDeliverablesProgress;
