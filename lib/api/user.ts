import api from "./client";
import { useAuth } from "@/store/auth";

export const getMyProfile = () => {
    const { token } = useAuth.getState();
    return api.get("/users/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const addAddress = (address: any) => {
    const { token } = useAuth.getState();
    return api.post("/users/me/addresses", address, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const updateAddress = (addressId: string, address: any) => {
    const { token } = useAuth.getState();
    return api.put(`/users/me/addresses/${addressId}`, address, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const deleteAddress = (addressId: string) => {
    const { token } = useAuth.getState();
    return api.delete(`/users/me/addresses/${addressId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};
