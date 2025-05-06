export const apiRequest = async (apiRoute: string, method: string, data?: any, header?: any, formData?: FormData) => {

    let fetchParams = {}
    if (!formData) {
        fetchParams = method === 'GET' ? ({
            method: method,
            headers: header,
        }) : ({
            method: method,
            headers: header,
            body: JSON.stringify({ ...data })
        });
    } else {
        fetchParams = {
            method: method,
            headers: header,
            body: formData
        }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}` + apiRoute || "", { ...fetchParams })
    console.log("Requested to: ", `${process.env.NEXT_PUBLIC_BASE_API_URL}` + apiRoute || "", { ...fetchParams });

    return response
}