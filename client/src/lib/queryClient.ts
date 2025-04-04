import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const [url, params] = queryKey;
    
    // Handle query parameters if they exist in the queryKey
    let finalUrl = url as string;
    
    if (params) {
      if (typeof params === 'object' && !Array.isArray(params)) {
        // Handle query parameters
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value === true) searchParams.append(key, 'true');
          else if (value === false) searchParams.append(key, 'false');
          else if (value != null) searchParams.append(key, String(value));
        });
        
        const queryString = searchParams.toString();
        if (queryString) {
          finalUrl += `?${queryString}`;
        }
      } else if (typeof params === 'string' || typeof params === 'number') {
        // Handle path parameter like /api/blog/posts/{slug}
        finalUrl += `/${params}`;
      }
    }
    
    const res = await fetch(finalUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
