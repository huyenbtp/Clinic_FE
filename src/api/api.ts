import { baseURL } from "./urls"

export const apiCall = async (
    endpoint: string,
    method: string,
    token: string | null,
    body: string | null,
    onSuccess: any,
    onFailure: any
) => {
    const url = baseURL + endpoint;
    console.log("API call:", method, url);

    let headers: Record<string, string> = {
        "Content-type": "application/json",
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const reqInf: RequestInit = {
        method,
        headers,
    };

    if (body) reqInf.body = body;

    try {
        const response = await fetch(url, reqInf);

        let data: any = null;
        try {
            data = await response.json();
        } catch (e) {
            // non-JSON response
            data = null;
        }

        if (response.ok) {
            console.log("API success:", data);
            onSuccess(data);
        } else {
            console.error("API error response:", response.status, data);
            onFailure(data || { message: `Request failed with status ${response.status}` });
        }
    } catch (err: any) {
        console.error("Network/API call failed:", err);
        onFailure({ message: err?.message || "Network error" });
    }
};