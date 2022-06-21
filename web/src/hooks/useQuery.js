import { useLocation } from "react-router";
import { useMemo } from "react";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

export { useQuery }