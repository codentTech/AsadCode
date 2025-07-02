import { enqueueSnackbar } from "notistack";
import { useState } from "react";

function usePitchTemplate() {
  const [pitchTemplates, setPitchTemplates] = useState([
    {
      id: 1,
      name: "Airbnb Pitch",
      content:
        "Hi! I'd love to showcase your property to my travel-focused audience. My content consistently drives bookings and engagement...",
    },
    {
      id: 2,
      name: "Restaurant Pitch",
      content:
        "I specialize in food content and would love to feature your restaurant. My audience loves discovering new dining experiences...",
    },
    {
      id: 3,
      name: "Hotels Pitch",
      content:
        "As a travel creator, I'd be excited to create content for your hotel. My previous hotel collaborations have generated significant bookings...",
    },
    {
      id: 4,
      name: "Airline Pitch",
      content:
        "I create travel content and would love to partner with your airline. My audience values travel experiences and flight recommendations...",
    },
    {
      id: 5,
      name: "Tourism Board Pitch",
      content:
        "I'm passionate about destination marketing and would love to showcase your location to my engaged travel audience...",
    },
  ]);

  const [showPitchPopup, setShowPitchPopup] = useState(false);
  const [showNewPitchForm, setShowNewPitchForm] = useState(false);
  const [newPitchTitle, setNewPitchTitle] = useState("");
  const [newPitchContent, setNewPitchContent] = useState("");
  const [applicationPitch, setApplicationPitch] = useState("");

  // Edit functionality states
  const [isEditing, setIsEditing] = useState(false);
  const [editPitchTitle, setEditPitchTitle] = useState("");
  const [editPitchContent, setEditPitchContent] = useState("");

  const copyPitchTemplate = (content) => {
    navigator.clipboard.writeText(content);
    setApplicationPitch(content);
    enqueueSnackbar("Text copied to clipboard", { variant: "info" });
  };

  const createNewPitch = () => {
    if (newPitchTitle && newPitchContent) {
      const newPitch = {
        id: Date.now(),
        name: newPitchTitle,
        content: newPitchContent,
      };
      setPitchTemplates([...pitchTemplates, newPitch]);
      setNewPitchTitle("");
      setNewPitchContent("");
      setShowNewPitchForm(false);
      enqueueSnackbar("Pitch template created successfully!", { variant: "success" });
    } else {
      enqueueSnackbar("Please fill in both pitch name and content", { variant: "error" });
    }
  };

  const updatePitch = (id, newTitle, newContent) => {
    if (newTitle && newContent) {
      setPitchTemplates(
        pitchTemplates.map((pitch) =>
          pitch.id === id ? { ...pitch, name: newTitle, content: newContent } : pitch
        )
      );

      // Update the showPitchPopup state to reflect the changes immediately
      setShowPitchPopup((prev) =>
        prev && prev.id === id ? { ...prev, name: newTitle, content: newContent } : prev
      );

      setEditPitchTitle("");
      setEditPitchContent("");
      enqueueSnackbar("Pitch template updated successfully!", { variant: "success" });
    } else {
      enqueueSnackbar("Please fill in both pitch name and content", { variant: "error" });
    }
  };

  const deletePitch = (id) => {
    setPitchTemplates(pitchTemplates.filter((pitch) => pitch.id !== id));
    setShowPitchPopup(false);
    setIsEditing(false);
    enqueueSnackbar("Pitch template deleted", { variant: "info" });
  };

  return {
    pitchTemplates,
    copyPitchTemplate,
    createNewPitch,
    updatePitch,
    deletePitch,
    setShowPitchPopup,
    setShowNewPitchForm,
    showPitchPopup,
    showNewPitchForm,
    newPitchTitle,
    newPitchContent,
    setNewPitchTitle,
    setNewPitchContent,
    applicationPitch,
    setApplicationPitch,
    isEditing,
    setIsEditing,
    editPitchTitle,
    editPitchContent,
    setEditPitchTitle,
    setEditPitchContent,
  };
}

export default usePitchTemplate;
