import React, { useState } from "react";

function useChatList() {
  const [selectedChat, setSelectedChat] = useState("Sam Waters");
  const [activeFilter, setActiveFilter] = useState("Saved");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const avatar =
    "https://static.vecteezy.com/system/resources/previews/049/005/561/non_2x/profile-shot-of-a-beautiful-young-brunette-with-wind-swept-hair-against-a-white-backdrop-photo.jpg";

  const filterOptions = ["Saved", "Rejected", "Trash"];

  const options = [
    { label: "Option One", value: "1" },
    { label: "Option Two", value: "2" },
    { label: "Option Three", value: "3" },
  ];

  const chats = [
    {
      name: "Sam Waters",
      message: "Hey, it was great meeting you at event last night!",
      time: "2:32 PM",
      avatar,
      rating: 4.5,
      unread: false,
      selected: true,
      online: true,
      me: false,
    },
    {
      name: "Alex Wong",
      message: "Your latest video is great girl!",
      time: "10:15 AM",
      avatar,
      unread: false,
      online: true,
      me: true,
    },
    {
      name: "Emily Davis",
      message: "Quick question about tonight's event ex I vicevara?",
      time: "Yesterday",
      avatar,
      unread: true,
      online: false,
      me: true,
    },
    {
      name: "Sarah Kim",
      message: "Hey girl, anytips for for pitching to L'Oreal?",
      time: "April 21",
      avatar,
      unread: false,
      online: true,
      me: true,
    },
    {
      name: "kylie anderson",
      message: "Hey girl, anytips for for pitching to L'Oreal?",
      time: "April 21",
      avatar,
      unread: true,
      online: true,
      me: true,
    },
    {
      name: "Kim stone",
      message: "Hey girl, anytips for for pitching to L'Oreal?",
      time: "April 21",
      avatar,
      unread: true,
      online: false,
      me: true,
    },
  ];

  return {
    filterOptions,
    chats,
    selectedChat,
    setSelectedChat,
    options,
    activeFilter,
    setActiveFilter,
    openFilterModal,
    setOpenFilterModal,
  };
}

export default useChatList;
