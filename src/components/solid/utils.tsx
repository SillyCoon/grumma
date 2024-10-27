import toast from "solid-toast";

export const fetchWithToast = async <T = undefined>(
	path: string,
	params: { method?: "POST" | "GET" | "DELETE"; body?: T },
	successMessage: string,
	errorMessage: string,
) => {
	const method = params.method ?? "GET";
	const body =
		params.body !== undefined ? JSON.stringify(params.body) : undefined;
	return fetch(path, { method, ...(body ? { body } : {}) })
		.then((response) => {
			if (response.ok) {
				toast.success(successMessage);
				return response;
			}
			toast.error(errorMessage);
		})
		.catch(() => {
			toast.error(errorMessage);
			return undefined;
		});
};
