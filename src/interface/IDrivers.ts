interface Drivers {
    id:number
    name:string
    licenseNumber:string
    phoneNumber:string
    email:string
    address:string
    familiarTrafficSigns:string
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
    Drivers,deleteId,value,parameter
}
