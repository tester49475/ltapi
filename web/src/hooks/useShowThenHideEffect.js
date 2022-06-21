import { useState } from "react";

const useShowThenHideEffect = (second) => {
    const [isShow, show] = useState(false);

    const showThenHide = () => {
        show(true);

        setTimeout(() => {
            show(false);
        }, 1000 * second);
    }

    return { isShow: isShow, show: showThenHide }
}

export { useShowThenHideEffect }
