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
    }
  };

  const deletePitch = (id) => {
    setPitchTemplates(pitchTemplates.filter((pitch) => pitch.id !== id));
    setShowPitchPopup(false);
  };

  return {
    pitchTemplates,
    copyPitchTemplate,
    createNewPitch,
    deletePitch,
    setShowPitchPopup,
    setShowNewPitchForm,
    showPitchPopup,
    showNewPitchForm,
    newPitchTitle,
    newPitchContent,
    setNewPitchTitle,
    setNewPitchContent,
  };
}

export default usePitchTemplate;
