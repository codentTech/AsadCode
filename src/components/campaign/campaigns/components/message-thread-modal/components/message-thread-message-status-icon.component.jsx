import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const MessageThreadMessageStatusIcon = ({ status }) => {
  if (status === "SENT") {
    return <DoneOutlinedIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />;
  }
  if (status === "DELIVERED") {
    return <DoneAllIcon sx={{ fontSize: 15, color: "#9CA3AF" }} />;
  }
  if (status === "SEEN") {
    return <DoneAllIcon sx={{ fontSize: 15, color: "#6366F1" }} />;
  }
  return null;
};

export default MessageThreadMessageStatusIcon;
