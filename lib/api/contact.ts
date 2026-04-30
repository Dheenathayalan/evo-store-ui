import client from "./client";

export const submitContactMessage = async (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  const res = await client.post("/contact", data);
  return res.data;
};
