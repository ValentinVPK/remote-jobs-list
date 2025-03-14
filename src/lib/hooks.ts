import { useState, useEffect } from "react";
import { JobItem, JobItemExpanded } from "./types";
import { BASE_API_URL } from "./constants";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

type JobItemApiResponse = {
  jobItem: JobItemExpanded;
  public: boolean;
};

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
};

// export function useJobItems(searchText: string) {
//   const [jobItems, setJobItems] = useState<JobItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!searchText) {
//       return;
//     }

//     const fetchData = async () => {
//       setIsLoading(true);
//       const response = await fetch(`${BASE_API_URL}?search=${searchText}`);

//       const data = await response.json();
//       setIsLoading(false);
//       setJobItems(data.jobItems);
//     };

//     fetchData();
//   }, [searchText]);

//   return { jobItems, isLoading };
// }

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
};

export function useJobItems(searchText: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["job-items", searchText],
    queryFn: () => fetchJobItems(searchText),
    staleTime: 1000 * 60 * 60, // 1 hour,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(searchText),
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return { jobItems: data?.jobItems, isLoading } as const;
}

// export function useJobItem(id: number | null) {
//   const [jobItem, setJobItem] = useState<JobItemExpanded | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!id) {
//       return;
//     }

//     const fetchJobItem = async () => {
//       setIsLoading(true);
//       const response = await fetch(`${BASE_API_URL}/${id}`);
//       const data = await response.json();
//       setIsLoading(false);
//       setJobItem(data.jobItem);
//     };

//     fetchJobItem();
//   }, [id]);

//   return { jobItem, isLoading };
// }

export function useJobItem(id: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["job-item", id],
    queryFn: () => (id ? fetchJobItem(id) : null),
    staleTime: 1000 * 60 * 60, // 1 hour,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return { jobItem: data?.jobItem, isLoading } as const;
}

export function useDebounce<T>(value: T, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}

export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeId;
}
