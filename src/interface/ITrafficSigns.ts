interface TrafficSigns {
    id:number
    name:string
    type:string
    meaning:string
    updateTime:string
}
interface parameter{
    pageNum: number
    pageSize: number
    name: string
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
    TrafficSigns,deleteId,value,parameter
}
