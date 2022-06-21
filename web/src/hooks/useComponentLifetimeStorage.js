import { useRef, useEffect } from "react"

const useComponentLifetimeStorage = () => {
    let ref = useRef({});

    const set = (key, value) => {
        ref.current[key] = value;
    }

    return { storage: ref.current, store: set }
}

export { useComponentLifetimeStorage }
