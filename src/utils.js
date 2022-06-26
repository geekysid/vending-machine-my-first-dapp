
export const formatException = error => {
    if (error.includes("while formatting outputs from RPC \'")) {
        const errorText = JSON.parse(error.split(" while formatting outputs from RPC \'").at(-1).replace("\'",""))
        return errorText.value.data.message;
        // console.log(errorText.value.data.message);
    }
}