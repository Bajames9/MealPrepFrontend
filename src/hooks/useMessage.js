import { useState } from "react";

export default function useMessage() {
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    const showMessage = (msg, msgType = "success") => {
        setMessage(msg);
        setType(msgType);

        setTimeout(() => {
            setMessage("");
            setType("");
        }, 3000);
    };

    return { message, type, showMessage };
}
