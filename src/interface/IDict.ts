interface Dict {
    id:number
    code:string
    value:string
    type:string
    deleted:number
}
interface parameter{
    pageNum: number
    pageSize: number
    code: string
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
    Dict,deleteId,value,parameter
}
