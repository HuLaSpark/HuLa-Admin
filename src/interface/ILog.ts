interface Log {
    id:number
    username:string
    operation:string
    method:string
    requestPath:string
    result:string
    time:string
    createTime:string
}
interface parameter{
    pageNum: number
    pageSize: number
    username: string
}

interface deleteId {
    id?: number
    ids?: number[]
}

interface value {
    code: string
    data?: any
    msg: string
}

export type {
    Log,deleteId,value,parameter
}
