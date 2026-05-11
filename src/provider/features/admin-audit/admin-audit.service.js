import api from "@/common/utils/api";

const getAdminAuditLogs = async (params) => {
  const response = await api().get("/admin/audit-logs", { params });
  return response.data;
};

const adminAuditService = {
  getAdminAuditLogs,
};

export default adminAuditService;
