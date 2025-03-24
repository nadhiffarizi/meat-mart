"use server"
export const apiRequest = async (apiRoute: string, method: string, data?: any, header?: any) => {

    const fetchParams = method === 'GET' ? ({
        method: method,
        headers: header,
    }) : ({
        method: method,
        headers: header,
        body: JSON.parse(JSON.stringify({ ...data }))
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}` + apiRoute || "", { ...fetchParams })
    console.log("Requested to: ", `${process.env.NEXT_PUBLIC_BASE_API_URL}` + apiRoute || "", { ...fetchParams });

    return response
}