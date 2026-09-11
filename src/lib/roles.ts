export type UserRole = "external" | "user" | "admin";

export const roleLabels: Record<UserRole, string> = {
  external: "External visitor",
  user: "Mia Meier",
  admin: "Facilities admin",
};

export const roleTaglines: Record<UserRole, string> = {
  external: "Not logged in",
  user: "Faculty of Arts & Sciences",
  admin: "Raumdisposition",
};
