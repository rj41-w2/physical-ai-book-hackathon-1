import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Replace with your production backend URL when deploying
    baseURL: "http://localhost:5000", 
});
