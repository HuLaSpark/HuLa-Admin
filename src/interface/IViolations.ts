interface Violations {
    id:number
    vehicleName:string
    vehicleOwner:string
    violationTime:string
    violationLocation:string
    violationReason:string
    fine:string
    status:string
    updateTime:string
}
interface parameter{
    pageNum: number
    pageSize: number
    vehicleName: string
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
    Violations,deleteId,value,parameter
}
